import type { Route } from '@angular/router'
import { AnalyticsComponent } from './analytics/analytics.component'
export const DASHBOARD_ROUTES: Route[] = [
  {
    path: '',
    component: AnalyticsComponent,
    data: { title: 'Dashboard' },
  },
  
]
