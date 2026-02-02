import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import type { User } from '@core/helper/fake-backend';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  user: User | null = null;

  public readonly authSessionKey = '_LAhomes_AUTH_SESSION_KEY_';
  public readonly employeeAuthSessionKey = '_LAhomes_EMPLOYEE_AUTH_SESSION_KEY_';
  public readonly userRoleKey = '_LAhomes_USER_ROLE_';

  private readonly BASE_API_URL = 'https://saaf.net.sa/api';
  private readonly AUTH_API_URL = 'https://saaf.net.sa/api/register';

  constructor(private http: HttpClient) {}


  requestOtp(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.AUTH_API_URL}/resend-otp`,
      { email }
    );
  }

  confirmResetPassword(
    email: string,
    OTP: number,
    newpassword: string
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.AUTH_API_URL}/forget-password`,
      { email, OTP, newpassword }
    );
  }

  resetPasswordViaToken(token: string, newpassword: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.AUTH_API_URL}/reset-password/${token}`,
      { newpassword }
    );
  }

  resetPassword(email: string): Observable<{ message: string }> {
  return this.http.post<{ message: string }>(
    `${this.BASE_API_URL}/password/reset`,
    { email }
  );
}

login(email: string, password: string): Observable<User> {
  return this.http.post<any>(`${this.BASE_API_URL}/login`, { email, password })
    .pipe(
      map((response) => {
        const token = response.token;
        const userData = response.user;

        if (!token || !userData) {
          throw new Error('Invalid response from server');
        }

        const rawRole = userData.role;
        const normalizedRole = String(rawRole).trim().toLowerCase();

        if (normalizedRole !== 'admin') {
          throw new Error('Access denied: Only admins can log in.');
        }

        this.saveSession(token);

        this.setRole('admin');

        this.user = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          token,
          role: 'admin'
        };

        return this.user as User;
      })
    );
}


  loginEmployee(email: string, password: string): Observable<User> {
    return this.http.post<any>(`${this.BASE_API_URL}/login/employee`, { email, password })
      .pipe(
        map((response) => {
          const token = response.token;
          const userData = response.user;

          if (token) {
            this.saveEmployeeSession(token);

            let role: 'admin' | 'accountant' | 'employee' = 'employee';
            const normalizedRole = String(userData?.role).trim().toLowerCase().replace(/\s+/g, '');

            if (['employee', 'employe', 'emp'].includes(normalizedRole)) {
              role = 'employee';
            } else if (['accountant', 'account', 'acc'].includes(normalizedRole)) {
              role = 'accountant';
            } else if (['admin', 'administrator', 'adm'].includes(normalizedRole)) {
              role = 'admin';
            }

            this.setRole(role);

            this.user = {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              token,
              role: userData.role
            };
          }

          return this.user as User;
        })
      );
  }


  signup(email: string, password: string): Observable<User> {
    return this.http
      .post<User>(`${this.BASE_API_URL}/register`, { email, password })
      .pipe(
        map((user) => {
          if (user && user.token) {
            this.user = user;
            this.saveSession(user.token);
          }
          return user;
        })
      );
  }


  unlock(password: string): Observable<{ success: boolean }> {
    if (!this.user?.email) {
      return throwError(() => new Error('No user session found.'));
    }

    return this.http
      .post<{ success: boolean }>(`${this.BASE_API_URL}/unlock`, {
        email: this.user.email,
        password,
      });
  }


  logout(): void {
    this.removeSession();
    this.removeEmployeeSession();
    this.removeRole();
    this.user = null;
  }

  get session(): string {
    return localStorage.getItem(this.authSessionKey) || '';
  }

  get employeeSession(): string {
    return localStorage.getItem(this.employeeAuthSessionKey) || '';
  }

  saveSession(token: string): void {
    localStorage.setItem(this.authSessionKey, token);
  }

  saveEmployeeSession(token: string): void {
    localStorage.setItem(this.employeeAuthSessionKey, token);
  }

  removeSession(): void {
    localStorage.removeItem(this.authSessionKey);
  }

  removeEmployeeSession(): void {
    localStorage.removeItem(this.employeeAuthSessionKey);
  }

  setRole(role: 'admin' | 'accountant' | 'employee'): void {
    localStorage.setItem(this.userRoleKey, role);
  }

  removeRole(): void {
    localStorage.removeItem(this.userRoleKey);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.authSessionKey);
  }

  isEmployeeLoggedIn(): boolean {
    return !!localStorage.getItem(this.employeeAuthSessionKey);
  }

  isAnyUserLoggedIn(): boolean {
    return this.isLoggedIn() || this.isEmployeeLoggedIn();
  }

  getCurrentToken(): string {
    return this.employeeSession || this.session;
  }
  get userRole(): 'admin' | 'accountant' | 'employee' {
  const role = localStorage.getItem(this.userRoleKey);

  if (!role) return 'employee';

  const normalized = String(role).trim().toLowerCase().replace(/\s+/g, '');

  if (['admin', 'administrator', 'adm'].includes(normalized)) return 'admin';
  if (['accountant', 'account', 'acc'].includes(normalized)) return 'accountant';
  return 'employee';
}

}
