// import { Routes } from '@angular/router'
// import { MasterWalletListComponent } from './master-wallet-list/master-wallet-list.component'

// export const Wallet_ROUTES: Routes = [
//   {
//     path: 'list',
//     component: MasterWalletListComponent,
//     data: { title: 'Master Wallet' },
//   },
// ]
import { Routes } from '@angular/router';
import { MasterWalletListComponent } from './master-wallet-list/master-wallet-list.component'; // مثال لاسم الكومبوننت

export const Wallet_ROUTES: Routes = [
  {
    path: 'master-wallet-list', // هذا هو الجزء الثاني من الرابط
    component: MasterWalletListComponent 
  },
  // يمكنك إضافة مسار افتراضي إذا كان الرابط هو master-wallet فقط
  {
    path: '',
    redirectTo: 'master-wallet-list',
    pathMatch: 'full'
  }
];