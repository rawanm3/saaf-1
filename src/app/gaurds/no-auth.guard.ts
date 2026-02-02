import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '@core/services/auth.service';

export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (authService.isAnyUserLoggedIn()) {
    switch (authService.userRole) {
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
  }

  return true;
};
