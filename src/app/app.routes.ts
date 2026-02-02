import { inject } from '@angular/core'
import { Router, Routes } from '@angular/router'
import { AuthenticationService } from '@core/services/auth.service'
import { AuthLayoutComponent } from '@layouts/auth-layout/auth-layout.component'
import { MainLayoutComponent } from '@layouts/main-layout/main-layout.component'
import { Error404Component } from '@views/extra/error404/error404.component'
import { DetailsComponent } from '@views/property/details/details.component'
import { UnauthorizedComponent } from '@views/extra/unauthorized/unauthorized.component'
import { AddEmployeeComponent } from '@views/employees/add-employee/add-employee.component'
import { EmployeesListComponent } from '@views/employees/employees-list/employees-list.component'
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboards',
    pathMatch: 'full',
  },
  {
     path: 'unauthorized',
     component: UnauthorizedComponent,
     data: { title: 'Unauthorized' },
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [
      (url: any) => {
        const router = inject(Router)
        const authService = inject(AuthenticationService)
        // Check if either admin or employee is logged in
        if (!authService.session && !authService.employeeSession) {
          return router.createUrlTree(['/auth/sign-in'], {
            queryParams: { returnUrl: url._routerState.url },
          })
        }
        return true
      },
    ],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./views/views.route').then((mod) => mod.VIEWS_ROUTES),
      },
      {
        path: 'properties/:id',
        component: DetailsComponent,
      },
       {
        path: 'employees',
        children: [
          {
            path: 'list',
            component: EmployeesListComponent,
            data: { title: 'قائمة الموظفين' }
          },
          {
            path: 'add',
            component: AddEmployeeComponent,
            data: { title: 'إضافة موظف جديد' }
          },
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full'
          }
        ]
      },
    ],
  },

  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./views/auth/auth.route').then((mod) => mod.AUTH_ROUTES),
  },

  {
    path: 'pages',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./views/extra/extra.route').then((mod) => mod.OTHER_PAGE_ROUTE),
  },

  {
    path: 'properties/:id',
    loadComponent: () =>
      import('@views/property/details/details.component').then(
        (m) => m.DetailsComponent
      ),
  },

  { path: '**', component: Error404Component },
]
