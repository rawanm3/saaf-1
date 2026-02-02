import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee, ApiResponse } from '@core/models/employee.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.employeeForm = this.createForm();
  }

  ngOnInit(): void {}

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_\-+=\[\{\];:'",<.>/?\\|`~]/.test(value);
    const isValidLength = value.length >= 8;

    const errors: ValidationErrors = {};

    if (!isValidLength) {
      errors['minlength'] = { requiredLength: 8, actualLength: value.length };
    }

    if (!hasUpperCase) {
      errors['uppercase'] = true;
    }

    if (!hasNumber) {
      errors['number'] = true;
    }

    if (!hasSpecialChar) {
      errors['specialChar'] = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, this.passwordValidator.bind(this)]],
      role: ['', [Validators.required]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(): Promise<void> {
    if (this.employeeForm.valid) {
      this.isLoading = true;
      const employeeData: Employee = this.employeeForm.value;

      this.employeeService.addEmployee(employeeData).subscribe({
        next: async (response: ApiResponse) => {
          this.isLoading = false;

          await Swal.fire({
            icon: 'success',
            title: this.translate.instant('COMMON.SUCCESS'),
            text: this.translate.instant('MESSAGES.EMPLOYEE_ADDED_SUCCESS'),
            confirmButtonText: this.translate.instant('COMMON.OK'),
            confirmButtonColor: '#3085d6',
            timer: 3000,
            timerProgressBar: true
          });

          this.resetForm();
        },
        error: async (error) => {
          this.isLoading = false;
          console.error('Error adding employee:', error);

          let errorMessage = this.translate.instant('MESSAGES.EMPLOYEE_ADD_ERROR');

          if (error.error?.message?.includes('already exists') || error.error?.message === 'User already exists') {
            errorMessage = this.translate.instant('MESSAGES.EMAIL_ALREADY_EXISTS');
          } else if (error.error?.message?.includes('enum')) {
            errorMessage = this.translate.instant('MESSAGES.INVALID_ROLE');
          } else if (error.status === 400) {
            if (error.error?.message?.includes('Password must be at least 8 characters')) {
              errorMessage = this.translate.instant('EMPLOYEE.ERROR.PASSWORD_REQUIREMENTS');
            }
          } else if (error.status === 500) {
            errorMessage = this.translate.instant('CUSTOMER.ERROR.SERVER');
          }

          await Swal.fire({
            icon: 'error',
            title: this.translate.instant('COMMON.ERROR'),
            text: errorMessage,
            confirmButtonText: this.translate.instant('COMMON.OK'),
            confirmButtonColor: '#d33'
          });
        }
      });
    } else {
      this.markFormGroupTouched();

      await Swal.fire({
        icon: 'warning',
        title: this.translate.instant('CUSTOMER.STATUS.WARNING'),
        text: this.translate.instant('CUSTOMER.STATUS.WARNING_MESSAGE'),
        confirmButtonText: this.translate.instant('COMMON.OK'),
        confirmButtonColor: '#f0ad4e'
      });
    }
  }

  resetForm(): void {
    this.employeeForm.reset({
      name: '',
      email: '',
      password: '',
      role: ''
    });

    this.employeeForm.markAsPristine();
    this.employeeForm.markAsUntouched();

    this.showPassword = false;

    Object.keys(this.employeeForm.controls).forEach(key => {
      const control = this.employeeForm.get(key);
      control?.setErrors(null);
    });
  }

  markFormGroupTouched(): void {
    Object.keys(this.employeeForm.controls).forEach(key => {
      const control = this.employeeForm.get(key);
      control?.markAsTouched();
    });
  }

  get name() { return this.employeeForm.get('name'); }
  get email() { return this.employeeForm.get('email'); }
  get password() { return this.employeeForm.get('password'); }
  get role() { return this.employeeForm.get('role'); }

  async cancel(): Promise<void> {
  if (this.employeeForm.dirty) {
    const result = await Swal.fire({
      icon: 'question',
      title: this.translate.instant('COMMON.CONFIRM_LEAVE_TITLE'),
      text: this.translate.instant('COMMON.CONFIRM_LEAVE'),
      showCancelButton: true,
      confirmButtonText: this.translate.instant('COMMON.YES'),
      cancelButtonText: this.translate.instant('COMMON.CANCEL'),
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    });

    if (result.isConfirmed) {
      this.resetForm();
    }
  } else {
    this.resetForm();
  }
}

  hasError(controlName: string, errorType: string): boolean {
    const control = this.employeeForm.get(controlName);
    return control ? (control.hasError(errorType) && (control.touched || control.dirty)) : false;
  }

  hasPasswordError(errorType: string): boolean {
    return this.hasError('password', errorType);
  }

  get passwordStrength(): number {
    const password = this.password?.value;
    if (!password) return 0;

    let strength = 0;

    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 10;

    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[!@#$%^&*()_\-+=\[\{\];:'",<.>/?\\|`~]/.test(password)) strength += 25;

    return Math.min(strength, 100);
  }
}
