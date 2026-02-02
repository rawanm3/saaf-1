import { Injectable } from '@angular/core'
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http'
import { Observable, of, throwError } from 'rxjs'
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators'

export type User = {
  id?: number
  username?: string
  password?: string
  firstName?: string
  lastName?: string
  name?: string
  token?: string
  email?: string
  avatar?: string
  location?: string
  title?: string
  role?: 'admin' | 'accountant' | 'employee' | 'employe'
}

type MyRequestBody = {
  username: string
  name: string
  password: string
  email: string
}

let Token: string =
  'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ0ZWNoemFhIiwiYXVkIjoiaHR0cHM6Ly90ZWNoemFhLmdldGFwcHVpLmNvbS8iLCJzdWIiOiJzdXBwb3J0QGNvZGVydGhlbWVzLmNvbSIsImxhc3ROYW1lIjoiVGVjaHphYSIsIkVtYWlsIjoidGVjaHphYXN0dWRpb0BnbWFpbC5jb20iLCJSb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJUZXN0VG9rZW4ifQ.ud4LnFZ-mqhHEYiPf2wCLM7KvLGoAxhXTBSymRIZEFLleFkO119AXd8p3OfPCpdUWSyeZl8-pZyElANc_KHj5w'
/**
 * @returns registered user list
 */
function getUsers(): User[] {
  let users: User[] = JSON.parse(sessionStorage.getItem('users')!) || [
    {
      id: 1,
      username: 'LaHomes',
      email: 'user@demo.com',
      password: '123456',
      firstName: 'LaHomes',
      lastName: 'admin',
      avatar: 'assets/images/users/user-1.jpg',
      location: 'California, USA',
      title: 'Admin Head',
      token: Token,
    },
  ]
  return users
}

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<MyRequestBody>,
    next: HttpHandler
  ): Observable<HttpEvent<Event>> {
    const authHeader = request.headers.get('Authorization')
    const isLoggedIn =
      authHeader && authHeader.startsWith('Bearer fake-jwt-token')
    let users: User[] = getUsers()
    return of(null)
      .pipe(
        mergeMap(() => {
          let temp: User[] = []
          if (request.url.endsWith('/api/login') && request.method === 'POST') {
            const user = users.find(
              (x) =>
                x.email === request.body?.email &&
                x.password === request.body?.password
            )
            if (!user) {
              return error('Email or password is incorrect')
            }
            return ok({
              ...user,
              name: user.firstName + ' ' + user.lastName,
            })
          }

          if (
            request.url.endsWith('/api/signup') &&
            request.method === 'POST'
          ) {
            const user = users.find(
              (x) =>
                x.email === request.body?.email &&
                x.password === request.body?.password
            )
            if (user) {
              return error('User Already Exists')
            } else {
              let [firstName, lastName] = request.body?.name.split(' ')!
              const newUser: User = {
                id: users.length + 1,
                username: firstName,
                email: request.body?.email,
                password: request.body?.password,
                firstName: firstName,
                lastName: lastName,
                avatar: 'assets/images/users/avatar-5.jpg',
                location: 'California, USA',
                token: Token,
              }
              temp = [...users]
              temp.push(newUser)
              sessionStorage.setItem('users', JSON.stringify(temp))
              return ok()
            }
          }

          return next.handle(request)
        })
      )
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize())

    function ok(body?: User) {
      return of(new HttpResponse({ status: 200, body }))
    }

    function unauthorised() {
      return throwError({ status: 401, error: { message: 'Unauthorised' } })
    }

    function error(message: string) {
      return throwError({ status: 400, error: { message } })
    }
  }
}

export let FakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
}
