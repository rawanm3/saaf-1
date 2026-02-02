import { Routes } from '@angular/router'
import { WalletListComponent } from './wallet-list/wallet-list.component'

export const Wallet_ROUTES: Routes = [
  {
    path: 'list',
    component: WalletListComponent,
    data: { title: 'Wallet' },
  },
]
