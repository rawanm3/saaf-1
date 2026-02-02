import { Inject, Injectable } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { of } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'
import {
  login,
  loginFailure,
  loginSuccess,
  logout,
  logoutSuccess,
  signup,
  signupFailure,
  signupSuccess,
  resetPassword,
  resetPasswordFailure,
  resetPasswordSuccess,
  unlock,
  unlockFailure,
  unlockSuccess,
} from './authentication.actions'
import { AuthenticationService } from '@core/services/auth.service'
import { ToastrService } from 'ngx-toastr'
import { TranslateService } from '@ngx-translate/core'

@Injectable()
export class AuthenticationEffects {
  constructor(
    @Inject(Actions) private actions$: Actions,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((user: any) => {
            const returnUrl =
              this.route.snapshot.queryParams['returnUrl'] || '/'
            this.router.navigateByUrl(returnUrl)
            this.toastr.success(
              this.translate.instant('AUTH.LOGIN.SUCCESS'),
              this.translate.instant('AUTH.GENERAL.SUCCESS')
            )
            return loginSuccess({ user })
          }),
          catchError((error) => {
            const message =
              typeof error === 'string'
                ? error
                : error?.error?.message ||
                  this.translate.instant('AUTH.LOGIN.FAILURE')
            this.toastr.error(
              message,
              this.translate.instant('AUTH.GENERAL.FAILURE')
            )
            return of(loginFailure({ error: message }))
          })
        )
      )
    )
  )

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      exhaustMap(() => {
        this.authService.logout()
        this.router.navigate(['/auth/sign-in'])
        this.toastr.info(
          this.translate.instant('AUTH.LOGOUT.INFO'),
          this.translate.instant('AUTH.GENERAL.INFO')
        )
        return of(logoutSuccess())
      })
    )
  )

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signup),
      exhaustMap(({ email, password }) =>
        this.authService.signup(email, password).pipe(
          map((user: any) => {
            this.toastr.success(
              this.translate.instant('AUTH.SIGNUP.SUCCESS'),
              this.translate.instant('AUTH.SIGNUP.WELCOME')
            )
            this.router.navigate(['/auth/sign-in'])
            return signupSuccess({ user })
          }),
          catchError((error) => {
            const message =
              typeof error === 'string'
                ? error
                : error?.error?.message ||
                  this.translate.instant('AUTH.SIGNUP.FAILURE')
            this.toastr.error(
              message,
              this.translate.instant('AUTH.GENERAL.FAILURE')
            )
            return of(signupFailure({ error: message }))
          })
        )
      )
    )
  )

  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(resetPassword),
      exhaustMap(({ email }) =>
        this.authService.resetPassword(email).pipe(
          map(() => {
            this.toastr.success(
              this.translate.instant('AUTH.RESET_PASSWORD.SUCCESS'),
              this.translate.instant('AUTH.RESET_PASSWORD.CHECK_INBOX')
            )
            return resetPasswordSuccess()
          }),
          catchError((error) => {
            const message =
              typeof error === 'string'
                ? error
                : error?.error?.message ||
                  this.translate.instant('AUTH.RESET_PASSWORD.FAILURE')
            this.toastr.error(
              message,
              this.translate.instant('AUTH.GENERAL.FAILURE')
            )
            return of(resetPasswordFailure({ error: message }))
          })
        )
      )
    )
  )

  unlock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(unlock),
      exhaustMap(({ password }) =>
        this.authService.unlock(password).pipe(
          map(() => {
            this.toastr.success(
              this.translate.instant('AUTH.UNLOCK.SUCCESS'),
              this.translate.instant('AUTH.UNLOCK.WELCOME_BACK')
            )
            return unlockSuccess()
          }),
          catchError((error) => {
            const message =
              typeof error === 'string'
                ? error
                : error?.error?.message ||
                  this.translate.instant('AUTH.UNLOCK.FAILURE')
            this.toastr.error(
              message,
              this.translate.instant('AUTH.GENERAL.FAILURE')
            )
            return of(unlockFailure({ error: message }))
          })
        )
      )
    )
  )
}
