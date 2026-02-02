import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Check employee token first, then admin token
  const employeeToken = localStorage.getItem('_LAhomes_EMPLOYEE_AUTH_SESSION_KEY_');
  const adminToken = localStorage.getItem('_LAhomes_AUTH_SESSION_KEY_');
  const token = employeeToken || adminToken;

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: token 
      }
    });
  } 

  return next(req);
};
