import type { Route } from '@angular/router'
import { ListComponent } from './list/list.component'
import { DetailsComponent } from './details/details.component'
import { AddComponent } from './add/add.component'
import { CyclesDetailsComponent } from './details/cycles-details/cycles-details.component'

export const PROPERTY_ROUTES: Route[] = [
  { path: 'list', component: ListComponent, data: { title: 'Listing Grid' } },
  {
    path: 'details/:id',
    component: DetailsComponent,
    data: { title: 'Property Overview' },
  },
  { path: ':propertyId/cycles', component: CyclesDetailsComponent },

  { path: 'add', component: AddComponent, data: { title: 'Add Property' } },
  {
    path: 'properties/:id',
    loadComponent: () =>
      import('@views/property/details/details.component').then(
        (m) => m.DetailsComponent
      ),
  },
]
