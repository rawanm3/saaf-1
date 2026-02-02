import type { Route } from '@angular/router'
import { InvestmentListComponent } from './list/list.component'
import { InvestmentDetailsComponent } from './details/details.component'

export const INVESTMENT_ROUTES: Route[] = [
  {
    path: '',
    component: InvestmentListComponent,
    data: { title: 'Investment List' },
  },
  {
    path: ':id',
    component: InvestmentDetailsComponent,
    data: { title: 'Investment Details' },
  },
]
