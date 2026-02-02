import { createAction, props } from '@ngrx/store'
import type { User } from './auth.model'

export const login = createAction(
  '[Authentication] Login',
  props<{ email: string; password: string }>()
)

export const loginSuccess = createAction(
  '[Authentication] Login Success',
  props<{ user: User }>()
)

export const loginFailure = createAction(
  '[Authentication] Login Failure',
  props<{ error: string }>()
)

export const logout = createAction('[Authentication] Logout')

export const logoutSuccess = createAction('[Auth] Logout Success')

export const signup = createAction(
  '[Authentication] Signup',
  props<{ email: string; password: string }>()
)

export const signupSuccess = createAction(
  '[Authentication] Signup Success',
  props<{ user: User }>()
)

export const signupFailure = createAction(
  '[Authentication] Signup Failure',
  props<{ error: string }>()
)

export const resetPassword = createAction(
  '[Authentication] Reset Password',
  props<{ email: string }>()
)

export const resetPasswordSuccess = createAction(
  '[Authentication] Reset Password Success'
)

export const resetPasswordFailure = createAction(
  '[Authentication] Reset Password Failure',
  props<{ error: string }>()
)

export const unlock = createAction(
  '[Authentication] Unlock',
  props<{ password: string }>()
)

export const unlockSuccess = createAction('[Authentication] Unlock Success')

export const unlockFailure = createAction(
  '[Authentication] Unlock Failure',
  props<{ error: string }>()
)
