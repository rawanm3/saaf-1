import { Component, inject, OnDestroy, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators,
  type UntypedFormGroup,
} from '@angular/forms'
import { Router, RouterModule } from '@angular/router'
import { LogoBoxComponent } from '@component/logo-box.component'
import { AuthenticationService } from '@core/services/auth.service'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-signin-employee',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LogoBoxComponent,
    TranslateModule,
  ],
  templateUrl: './signin-employee.component.html',
  styles: [`
    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
    }
    .auth-card {
      border: none;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .field-error {
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `],
})
export class SigninEmployeeComponent implements OnDestroy {
  signinForm!: UntypedFormGroup
  submitted = signal(false)
  loading = signal(false)
  errorMessage = signal('')

  private subscriptions = new Subscription()

  public fb = inject(UntypedFormBuilder)
  router = inject(Router)
  authService = inject(AuthenticationService)
  translate = inject(TranslateService)

  constructor() {
    this.initializeForm()

    if (this.authService.isEmployeeLoggedIn()) {
      this.router.navigate(['/dashboards'])
    }
  }

  private initializeForm(): void {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  get form() {
    return this.signinForm.controls
  }

  onLogin(): void {
    this.submitted.set(true)
    this.errorMessage.set('')

    if (this.signinForm.valid) {
      this.loading.set(true)
      const email = this.form['email'].value
      const password = this.form['password'].value

      this.subscriptions.add(
        this.authService.loginEmployee(email, password).subscribe({
          next: (user) => {
            this.loading.set(false)
            // Redirect both admin and employee users to the same dashboard
            this.router.navigate(['/dashboards'])
          },
          error: (error) => {
            this.loading.set(false)
            const errorMsg = error.error?.message || this.translate.instant('ERROR.LOGIN_FAILED')
            this.errorMessage.set(errorMsg)
            console.error('Employee login error:', error)
          }
        })
      )
    } else {
      this.errorMessage.set(this.translate.instant('VALIDATION.FILL_ALL_FIELDS'))
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form[fieldName]
    return this.submitted() && field.invalid
  }

  getFieldError(fieldName: string): string {
    const field = this.form[fieldName]

    if (field.errors?.['required']) {
      return this.translate.instant('VALIDATION.FIELD_REQUIRED')
    }

    if (field.errors?.['email']) {
      return this.translate.instant('VALIDATION.INVALID_EMAIL')
    }

    if (field.errors?.['minlength']) {
      return this.translate.instant('VALIDATION.PASSWORD_MIN_LENGTH',
        { min: field.errors?.['minlength']?.requiredLength })
    }

    return ''
  }

  goToSignin(): void {
    this.router.navigate(['/auth/sign-in'])
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }
}
