import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomersService } from '@core/services/customers.service';
import { TranslateModule } from '@ngx-translate/core';
import { CustomerPayload } from '../../../../core/models/customer.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

interface FileMap {
  [key: string]: File;
}

@Component({
  selector: 'customer-info',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, TranslateModule],
  templateUrl: './customer-info.component.html',
  styles: [``],
})
export class CustomerInfoComponent implements OnInit {
  customerForm: FormGroup;
  debugPayload!: CustomerPayload;
  missingFields: string[] = [];
  selectedFiles: FileMap = {};
  isSubmitting = false;
  selectedCountryCode: string = '20'; // Default country code for Egypt

  private readonly requiredFields = [
    'name',
    'nationalId',
    'country',
    'password',
    'phone',
    'email',
    'nationalIdImageUrl',
    'ibanImageUrl',
  ];

  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService,
    private router: Router
  ) {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      nameEN: ['', [Validators.minLength(2)]],
      nationalId: ['', [Validators.required]], // No min/max length
      country: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]], // Numbers only, no +
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
        ],
      ],
      nafathSub: [''],
      iban: ['', [Validators.required, Validators.pattern(/^[0-9]{15,34}$/)]],
      nationalIdImageUrl: ['', Validators.required],
      ibanImageUrl: ['', Validators.required],
      profileImage: [''],
      status: ['confirmed', Validators.required],
      role: ['user', Validators.required],
    });
  }

  ngOnInit(): void {
    this.customerForm.get('country')?.valueChanges.subscribe((value: string) => {
      const v = (value || '').toLowerCase();
      const passwordControl = this.customerForm.get('password');
      const nafathControl = this.customerForm.get('nafathSub');

      if (v === 'sa' || v === 'saudi arabia' || v === 'ksa') {
        nafathControl?.setValidators([Validators.required]);
        passwordControl?.clearValidators();
        passwordControl?.setValue('');
      } else {
        passwordControl?.setValidators([
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
        ]);
        nafathControl?.clearValidators();
        nafathControl?.setValue('');
      }

      passwordControl?.updateValueAndValidity({ emitEvent: false });
      nafathControl?.updateValueAndValidity({ emitEvent: false });
    });
  }

  formatPhoneNumber(event: any): void {
    let value = event.target.value;
    // Remove any non-digit characters
    value = value.replace(/[^0-9]/g, '');

    // Limit to 15 digits
    if (value.length > 15) {
      value = value.slice(0, 15);
    }

    // Update the form control value without emitting event to avoid loop
    this.customerForm.get('phone')?.setValue(value, { emitEvent: false });
  }

  onFileSelected(event: Event, field: keyof FileMap): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  if (!['image/png', 'image/jpeg'].includes(file.type)) {
    Swal.fire('خطأ', 'يُسمح فقط بصور JPG أو PNG', 'warning');
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    Swal.fire('حجم الملف كبير', 'الحد الأقصى هو 10 ميجابايت', 'warning');
    return;
  }

  this.selectedFiles[field] = file;
  this.customerForm.patchValue({ [field]: file.name });
  this.customerForm.get(field as string)?.updateValueAndValidity();
}

  private buildPayload(): CustomerPayload {
    const fv = this.customerForm.value;
    const country = fv.country?.trim().toLowerCase();

    // Combine selected country code with phone number
    const fullPhoneNumber = fv.phone ? `+${this.selectedCountryCode}${fv.phone}` : '';

    const payload: CustomerPayload = {
      name: fv.name?.trim(),
      nameEN: fv.nameEN?.trim(),
      nationalId: fv.nationalId?.trim(),
      country: fv.country?.trim(),
      email: fv.email?.trim(),
      phone: fullPhoneNumber, // Phone with selected country code
      iban: fv.iban?.trim(),
      nationalIdImageUrl: fv.nationalIdImageUrl?.trim(),
      ibanImageUrl: fv.ibanImageUrl?.trim(),
      profileImage: fv.profileImage?.trim(),
      status: fv.status || 'pending',
      role: fv.role || 'user',
      customerStatus: fv.status,
    };

    if (country !== 'sa' && country !== 'saudi arabia' && country !== 'ksa') {
      payload.password = fv.password;
    } else {
      payload.nafathSub = fv.nafathSub;
    }

    return payload;
  }

  private computeMissingFields(payload: CustomerPayload): string[] {
    const isSaudi = ['sa', 'saudi arabia', 'ksa'].includes(payload.country?.toLowerCase() || '');
    return this.requiredFields.filter((f) => {
      if (f === 'password' && isSaudi) return false;
      const val = (payload as any)[f];
      return val === undefined || val === null || String(val).trim() === '';
    });
  }

  private refreshDebug(): void {
    this.debugPayload = this.buildPayload();
    this.missingFields = this.computeMissingFields(this.debugPayload);
  }

  private extractErrorMessage(error: any): string {
    console.log('Full error object:', error);

    if (error?.error?.message && error?.error?.error) {
      const mainMessage = error.error.message;
      const validationErrors = error.error.error;

      if (typeof validationErrors === 'string') {
        if (validationErrors.includes('validation failed')) {
          const formattedErrors = this.parseValidationErrorText(validationErrors);
          if (formattedErrors) {
            return `<strong>${mainMessage}</strong><br><br>${formattedErrors}`;
          }
        }
        return `<strong>${mainMessage}</strong><br>${validationErrors}`;
      }
    }

    if (error?.error?.message) {
      return error.error.message;
    }

    if (error?.error?.errors) {
      if (Array.isArray(error.error.errors)) {
        return error.error.errors.join('<br>');
      } else if (typeof error.error.errors === 'object') {
        const messages: string[] = [];

        for (const [field, fieldErrors] of Object.entries(error.error.errors)) {
          if (Array.isArray(fieldErrors)) {
            const fieldName = this.getFieldDisplayName(field);
            messages.push(`<strong>${fieldName}:</strong> ${fieldErrors.join(', ')}`);
          } else if (typeof fieldErrors === 'string') {
            messages.push(fieldErrors);
          }
        }

        return messages.join('<br>');
      }
    }

    if (error?.message) {
      return error.message;
    }

    return error?.error?.message || error?.message || 'حدث خطأ غير متوقع';
  }

  private parseValidationErrorText(errorText: string): string {
    const errorParts = errorText.split(': ');
    if (errorParts.length < 2) return errorText;

    const detailedErrors = errorParts.slice(1).join(': ');
    const individualErrors = detailedErrors.split(', ');

    const formattedErrors = individualErrors.map(error => {
      const parts = error.split(': ');
      if (parts.length === 2) {
        const field = parts[0];
        const message = parts[1];
        const fieldName = this.getFieldDisplayName(field);

        let enhancedMessage = message;
        if (message.includes('is not a valid National ID')) {
          enhancedMessage = 'رقم الهوية غير صالح';
        } else if (message.includes('is not a valid email')) {
          enhancedMessage = 'البريد الإلكتروني غير صالح';
        } else if (message.includes('already exists')) {
          enhancedMessage = 'مسجل مسبقاً';
        } else if (message.includes('required')) {
          enhancedMessage = 'حقل مطلوب';
        }

        return `<strong>${fieldName}:</strong> ${enhancedMessage}`;
      }
      return error;
    });

    return formattedErrors.join('<br>');
  }

  private getFieldDisplayName(field: string): string {
    const fieldNames: { [key: string]: string } = {
      name: 'الاسم العربي',
      nameEN: 'الاسم الإنجليزي',
      nationalId: 'رقم الهوية',
      country: 'البلد',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      password: 'كلمة المرور',
      nafathSub: 'نفاذ',
      iban: 'رقم الآيبان',
      nationalIdImageUrl: 'صورة الهوية',
      ibanImageUrl: 'صورة الآيبان',
      profileImage: 'الصورة الشخصية',
    };

    return fieldNames[field] || field;
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const payload = this.buildPayload();

    this.customersService
      .addCustomer(payload, {
        nationalIdImageUrl: this.selectedFiles['nationalIdImageUrl'],
        ibanImageUrl: this.selectedFiles['ibanImageUrl'],
        profileImage: this.selectedFiles['profileImage'],
      })
      .subscribe({
        next: (res: any) => {
          this.isSubmitting = false;

          const response = res.body || res;
          const successMessage = response?.message ||
                                response?.data?.message ||
                                'تم إنشاء العميل بنجاح!';

          Swal.fire({
            icon: 'success',
            title: 'تم بنجاح',
            text: successMessage,
            confirmButtonText: 'حسناً',
          }).then(() => {
            this.customerForm.reset({
              status: 'confirmed',
              role: 'user'
            });
            this.selectedFiles = {};
            this.router.navigate(['/customers/list']);
          });
        },
        error: (err: any) => {
          this.isSubmitting = false;
          const errorMessage = this.extractErrorMessage(err);
          Swal.fire({
            icon: 'error',
            html: errorMessage,
            confirmButtonText: 'حسناً',
          });
        }
      });
  }
}
