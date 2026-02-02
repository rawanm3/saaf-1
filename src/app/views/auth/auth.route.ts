import type { Route } from '@angular/router'
import { SigninComponent } from './signin/signin.component'
import { SignupComponent } from './signup/signup.component'
import { PasswordComponent } from './password/password.component'
import { LockScreenComponent } from './lock-screen/lock-screen.component'
import { SigninEmployeeComponent } from './signin-employee/signin-employee.component'
import { noAuthGuard } from '../../gaurds/no-auth.guard'

export const AUTH_ROUTES: Route[] = [
  {
    path: 'sign-in',
    component: SigninComponent,
    canActivate: [noAuthGuard],
    data: { title: 'Sign In' },
  },
   {
    path: 'sign-in-employee',
    component: SigninEmployeeComponent,
    canActivate: [noAuthGuard],
    data: { title: 'Employee Sign In' },
  },
  {
    path: 'sign-up',
    component: SignupComponent,
    canActivate: [noAuthGuard],
    data: { title: 'Sign Up' },
  },
  {
    path: 'reset-password',
    component: PasswordComponent,
    data: { title: 'Rest Password' },
  },
  {
    path: 'lock-screen',
    component: LockScreenComponent,
    data: { title: 'Lock Screen' },
  },
]
