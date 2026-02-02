import type { Route } from '@angular/router'
import { ComingSoonComponent } from './coming-soon/coming-soon.component'
import { MaintenanceComponent } from './maintenance/maintenance.component'
import { Error404Component } from './error404/error404.component'
import { UnauthorizedComponent } from './unauthorized/unauthorized.component'


export const OTHER_PAGE_ROUTE: Route[] = [
  {
    path: 'coming-soon',
    component: ComingSoonComponent,
    data: { title: 'Coming Soon' },
  },
  {
    path: 'maintenance',
    component: MaintenanceComponent,
    data: { title: 'Maintenance' },
  },
  {
    path: '404-error',
    component: Error404Component,
    data: { title: 'Page Not Found - 404' },
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
    data: { title: 'Unauthorized' },
  },
]
