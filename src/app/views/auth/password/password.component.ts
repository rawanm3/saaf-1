import { Component, inject, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LogoBoxComponent } from '@component/logo-box.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '@core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [RouterLink, LogoBoxComponent, FormsModule, CommonModule , TranslateModule ],
  templateUrl: './password.component.html',
  styles: `
    .text-timer { font-weight: bold; color: #dc3545; }
    .password-reqs { font-size: 0.75rem; color: #6c757d; margin-top: 4px; }
    .password-reqs.valid { color: #198754; }
    .password-reqs.invalid { color: #dc3545; }
  `,
})
export class PasswordComponent implements OnDestroy {
  authService = inject(AuthenticationService);
  router = inject(Router);

  currentStep = 1;
  
  formData = {
    email: '',
    OTP: '',
    newpassword: '',
    confirmPassword: ''
  };

  isLoading = false;
  message = '';
  isError = false;

  resendTimer = 0;
  private timerInterval: any;

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startResendTimer() {
    this.resendTimer = 90; 
    if (this.timerInterval) clearInterval(this.timerInterval);
    
    this.timerInterval = setInterval(() => {
      if (this.resendTimer > 0) {
        this.resendTimer--;
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  handleEmailStep() {
    if (!this.formData.email) {
      this.showError('Please enter a valid email address.');
      return;
    }

    this.sendOtpCall();
  }

  sendOtpCall() {
    this.isLoading = true;
    this.message = '';

    this.authService.requestOtp(this.formData.email).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.isError = false;
        this.currentStep = 2;
        
        this.startResendTimer();
        this.message = `OTP sent to ${this.formData.email}!`;
      },
      error: (err) => {
        this.isLoading = false;
        this.showError(err.error?.message || 'Failed to send OTP.');
      }
    });
  }

  resendOtp() {
    if (this.resendTimer > 0) return; 
    this.sendOtpCall();
  }

  handleFinalStep() {
    this.message = '';
    this.isError = false;

    if (!this.formData.OTP) {
      this.showError('Please enter the OTP code.');
      return;
    }

    const password = this.formData.newpassword;
    
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!strongPasswordRegex.test(password)) {
      this.showError('Password does not meet complexity requirements.');
      return;
    }

    if (password !== this.formData.confirmPassword) {
      this.showError('Passwords do not match.');
      return;
    }

    // 3. API Call
    this.isLoading = true;
    const otpNumber = Number(this.formData.OTP);

    this.authService.confirmResetPassword(
      this.formData.email,
      otpNumber,
      password
    ).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.message = 'Password reset successfully! Redirecting...';
        this.isError = false;
        
        setTimeout(() => {
          this.router.navigate(['/auth/sign-in']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.showError(err.error?.message || 'Error resetting password.');
      }
    });
  }

  showError(msg: string) {
    this.message = msg;
    this.isError = true;
  }
}