import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

import { EmployeeService } from '@core/services/employee.service';
import { Employee } from '@core/models/employee.model';

@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, ReactiveFormsModule],
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss']
})
export class EmployeesListComponent implements OnInit {
  employees: Employee[] = [];
  isLoading: boolean = false;
  isUpdating: boolean = false;
  errorMessage: string = '';
  editErrorMessage: string = '';
  showEditModal: boolean = false;
  showEditPassword: boolean = false;
  showEditConfirmPassword: boolean = false;
  editForm: FormGroup;
  selectedEmployee: Employee = {
    name: '',
    email: '',
    role: 'employe',
    password: ''
  };

  constructor(
    private employeeService: EmployeeService,
    private translate: TranslateService,
    private fb: FormBuilder
  ) {
    this.editForm = this.createEditForm();
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  createEditForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: [''],
      role: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading employees:', error);
        this.showErrorAlert(this.getErrorMessage(error));
      }
    });
  }

  editEmployee(employee: Employee): void {
    this.selectedEmployee = { ...employee };
    this.editForm.patchValue({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      password: '',
      confirmPassword: ''
    });
    this.editErrorMessage = '';
    this.showEditModal = true;
    this.showEditPassword = false;
    this.showEditConfirmPassword = false;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedEmployee = {
      name: '',
      email: '',
      role: 'employe',
      password: ''
    };
    this.editForm.reset({
      role: 'employe'
    });
    this.editErrorMessage = '';
    this.isUpdating = false;
  }

  async updateEmployee(): Promise<void> {
    if (this.editForm.invalid) {
      this.markEditFormTouched();
      return;
    }

    if (!this.selectedEmployee._id) {
      this.editErrorMessage = this.translate.instant('EMPLOYEE.ERROR.INVALID_EMPLOYEE_ID');
      return;
    }

    this.isUpdating = true;
    this.editErrorMessage = '';

    const updateData: any = {
      name: this.editForm.get('name')?.value,
      email: this.editForm.get('email')?.value,
      role: this.editForm.get('role')?.value
    };

    const password = this.editForm.get('password')?.value;
    if (password && password.trim() !== '') {
      updateData.password = password;
    }

    this.employeeService.updateEmployee(this.selectedEmployee._id, updateData).subscribe({
      next: async (response) => {
        this.isUpdating = false;
        await this.showSuccessAlert('EMPLOYEE.UPDATE_SUCCESS');
        this.closeEditModal();
        this.loadEmployees();
      },
      error: async (error) => {
        this.isUpdating = false;
        console.error('Error updating employee:', error);
        this.editErrorMessage = this.getErrorMessage(error);
        await this.showErrorAlert(this.editErrorMessage);
      }
    });
  }

  async deleteEmployee(id: string): Promise<void> {
    const result = await Swal.fire({
      title: this.translate.instant('COMMON.CONFIRM_DELETION'),
      text: this.translate.instant('EMPLOYEE.CONFIRM_DELETE'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: this.translate.instant('COMMON.DELETE'),
      cancelButtonText: this.translate.instant('COMMON.CANCEL')
    });

    if (result.isConfirmed) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: async (response) => {
          await this.showSuccessAlert('EMPLOYEE.DELETE_SUCCESS');
          this.loadEmployees();
        },
        error: async (error) => {
          console.error('Error deleting employee:', error);
          await this.showErrorAlert(this.getErrorMessage(error));
        }
      });
    }
  }

  hasEditError(controlName: string, errorType: string): boolean {
    const control = this.editForm.get(controlName);
    return control ? (control.hasError(errorType) && (control.touched || control.dirty)) : false;
  }

  markEditFormTouched(): void {
    Object.keys(this.editForm.controls).forEach(key => {
      const control = this.editForm.get(key);
      control?.markAsTouched();
    });
  }

  toggleEditPasswordVisibility(): void {
    this.showEditPassword = !this.showEditPassword;
  }

  toggleEditConfirmPasswordVisibility(): void {
    this.showEditConfirmPassword = !this.showEditConfirmPassword;
  }

  getRoleDisplayName(role: string): string {
    const roleNames: { [key: string]: string } = {
      'employe': 'EMPLOYEE.ROLE_EMPLOYEE',
      'accountant': 'EMPLOYEE.ROLE_ACCOUNTANT'
    };
    return roleNames[role] || role;
  }

  getRoleBadgeClass(role: string): string {
    const badgeClasses: { [key: string]: string } = {
      'employe': 'badge bg-primary',
      'accountant': 'badge bg-success'
    };
    return badgeClasses[role] || 'badge bg-secondary';
  }

  private getErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }

    if (error.error?.errors && Array.isArray(error.error.errors)) {
      return error.error.errors.map((err: any) => err.msg || err.message).join(', ');
    }

    if (error.error?.errors && typeof error.error.errors === 'object') {
      return Object.values(error.error.errors).join(', ');
    }

    if (error.message) {
      return error.message;
    }

    switch (error.status) {
      case 0: return this.translate.instant('MESSAGES.NETWORK_ERROR');
      case 400: return this.translate.instant('MESSAGES.BAD_REQUEST');
      case 401: return this.translate.instant('MESSAGES.UNAUTHORIZED');
      case 403: return this.translate.instant('MESSAGES.FORBIDDEN');
      case 404: return this.translate.instant('MESSAGES.NOT_FOUND');
      case 409: return this.translate.instant('MESSAGES.CONFLICT');
      case 422: return this.translate.instant('MESSAGES.VALIDATION_ERROR');
      case 500: return this.translate.instant('MESSAGES.SERVER_ERROR');
      default: return this.translate.instant('MESSAGES.UNKNOWN_ERROR');
    }
  }

  private async showSuccessAlert(messageKey: string) {
    await Swal.fire({
      icon: 'success',
      title: this.translate.instant('COMMON.SUCCESS'),
      text: this.translate.instant(messageKey),
      confirmButtonColor: '#3085d6',
      confirmButtonText: this.translate.instant('COMMON.OK')
    });
  }

  private async showErrorAlert(message: string) {
    await Swal.fire({
      icon: 'error',
      title: this.translate.instant('COMMON.ERROR'),
      text: message,
      confirmButtonColor: '#d33',
      confirmButtonText: this.translate.instant('COMMON.OK')
    });
  }
}
