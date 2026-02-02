import type { Route } from '@angular/router'
import { TransactionsComponent } from './apps/transactions/transactions.component'
import { WidgetsComponent } from './apps/widgets/widgets.component'

import { SettingsComponent } from './settings/component/settings/settings.component'
import { AnalyticsComponent } from './dashboards/analytics/analytics.component'
import { WalletListComponent } from './Wallet/wallet-list/wallet-list.component'
import { CyclesDetailsComponent } from './property/details/cycles-details/cycles-details.component'

import { roleGuard } from '../gaurds/auth.guard'


export const VIEWS_ROUTES: Route[] = [
  {
    path: 'dashboards',
    component: AnalyticsComponent,
    canActivate: [roleGuard],
    data: { title: 'Dashboard' },
  },
//   {
//   path: 'dashboards',
//   canActivate: [roleGuard],
//   data: { roles: ['admin', 'accountant', 'employee'] },
//   redirectTo: 'dashboards/employee',
//   pathMatch: 'full',
// },

  {
  path: 'dashboards/admin',
  component: AnalyticsComponent,
  canActivate: [roleGuard],
  data: { roles: ['admin'], title: 'Admin Dashboard' },
},
{
  path: 'dashboards/accountant',
  component: AnalyticsComponent,
  canActivate: [roleGuard],
  data: { roles: ['accountant'], title: 'Accountant Dashboard' },
},
{
  path: 'dashboards/employee',
  component: AnalyticsComponent,
  canActivate: [roleGuard],
  data: { roles: ['employee'], title: 'Employee Dashboard' },
},

{
  path: 'property',
  canActivate: [roleGuard],
  data: { roles: ['admin', 'employee', 'accountant'] },
  loadChildren: () =>
    import('./property/property.route').then(mod => mod.PROPERTY_ROUTES),
},

  { path: ':propertyId/cycles', component: CyclesDetailsComponent }
  ,
  {
    path: 'agents',
      canActivate: [roleGuard],
  data: { roles: ['admin', 'accountant'] },
    loadChildren: () =>
      import('./agents/agents.route').then((mod) => mod.AGENT_ROUTES),
  },
{
  path: 'customers',
  canActivate: [roleGuard],
  canActivateChild: [roleGuard],
  // data: { roles: ['admin'] },
  data: { roles: ['admin', 'employee'] },
  loadChildren: () =>
    import('./customers/customers.route').then(mod => mod.CUSTOMER_ROUTES),
},


  {
    path: 'investment',
      canActivate: [roleGuard],
  data: { roles: ['admin', 'accountant'] },
    // canActivate: [adminGuard], 
    loadChildren: () =>
      import('./investments/investment.route').then(
        (mod) => mod.INVESTMENT_ROUTES
      ),
  },

  {
    path: 'transactions',
    component: TransactionsComponent,
      canActivate: [roleGuard],
  data: { roles: ['admin', 'accountant'] },
    // canActivate: [adminGuard], 
    // data: { title: 'Transactions' },
  },
  {
    path: 'wallet',
    // canActivate: [adminGuard], 
      canActivate: [roleGuard],
  data: { roles: ['admin', 'accountant'] },
    loadChildren: () =>
      import('./Wallet/wallet.route').then((mod) => mod.Wallet_ROUTES),
  },
  {
    path: 'distributions',
      canActivate: [roleGuard],
  data: { roles: ['admin', 'accountant'] },
    // canActivate: [adminGuard], 
    loadChildren: () =>
      import('./Distributions/Distributions.route').then((mod) => mod.Wallet_ROUTES),
  },
  {
    path: 'pages',
    loadChildren: () =>
      import('./pages/pages.route').then((mod) => mod.PAGES_ROUTES),
  },
  {
    path: 'widgets',
    component: WidgetsComponent,
    data: { title: 'Widgets' },
  },
  {
    path: 'extended',
    loadChildren: () =>
      import('./extended/extended.route').then((mod) => mod.EXTENDED_ROUTES),
  },
  {
    path: 'charts',
    loadChildren: () =>
      import('./charts/charts.route').then((mod) => mod.CHART_ROUTES),
  },
  {
    path: 'forms',
    loadChildren: () =>
      import('./forms/forms.route').then((mod) => mod.FORMS_ROUTES),
  },
  {
    path: 'tables',
    loadChildren: () =>
      import('./tables/table.route').then((mod) => mod.TABLE_ROUTES),
  },
  {
    path: 'icons',
    loadChildren: () =>
      import('./icons/icons.route').then((mod) => mod.ICONS_ROUTES),
  },
]
