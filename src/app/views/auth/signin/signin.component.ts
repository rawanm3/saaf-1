import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
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
import { Store } from '@ngrx/store'
import { login } from '@store/authentication/authentication.actions'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LogoBoxComponent,
    TranslateModule,
  ],
  templateUrl: './signin.component.html',
  styles: ``,
})
export class SigninComponent {
  signinForm!: UntypedFormGroup
  submitted: boolean = false

  public fb = inject(UntypedFormBuilder)
  store = inject(Store)
  router = inject(Router)
  service = inject(AuthenticationService)

  constructor() {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  get form() {
    return this.signinForm.controls
  }

  onLogin() {
    this.submitted = true
    if (this.signinForm.valid) {
      const email = this.form['email'].value
      const password = this.form['password'].value
      this.store.dispatch(login({ email: email, password: password }))
    }
  }

  goToEmployeeSignin() {
    this.router.navigate(['/auth/sign-in-employee']);
  }
}
