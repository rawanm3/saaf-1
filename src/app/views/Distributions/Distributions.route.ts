import { Routes } from '@angular/router'
import { DistributionListComponent } from './distribution-list/distribution-list.component'

export const Wallet_ROUTES: Routes = [
  {
    path: 'list',
    component: DistributionListComponent,
    data: { title: 'Distribution' },
  },
]
