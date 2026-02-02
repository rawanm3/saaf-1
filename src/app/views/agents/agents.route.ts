import type { Route } from '@angular/router'
import { ListComponent } from './list/list.component'
import { GridComponent } from './grid/grid.component'
import { DetailsComponent } from './details/details.component'
import { AddComponent } from './add/add.component'

export const AGENT_ROUTES: Route[] = [
  { path: 'list', component: ListComponent, data: { title: 'Agent List' } },
  { path: 'grid', component: GridComponent, data: { title: 'Agent Grid' } },
  {
    path: 'details',
    component: DetailsComponent,
    data: { title: 'Agent Overview' },
  },
  { path: 'add', component: AddComponent, data: { title: 'Add Agent' } },
]
