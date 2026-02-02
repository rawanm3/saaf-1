import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '@core/services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (!authService.isAnyUserLoggedIn()) {
    router.navigate(['/auth/sign-in']);
    return false;
  }

  const allowedRoles = route.data?.['roles'] as Array<'admin' | 'accountant' | 'employee'>;
  const userRole = authService.userRole;

  if (!allowedRoles || allowedRoles.includes(userRole)) {
    return true;
  }

  switch (userRole) {
    case 'admin':
      router.navigate(['/dashboards/admin']);
      break;
    case 'accountant':
      router.navigate(['/dashboards/accountant']);
      break;
    default:
      router.navigate(['/dashboards/employee']);
  }

  return false;
};
