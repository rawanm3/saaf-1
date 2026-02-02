import type { Route } from '@angular/router'
import { BasicComponent } from './basic/basic.component'
import { DataTableComponent } from './data-table/data-table.component'

export const TABLE_ROUTES: Route[] = [
  {
    path: 'basic',
    component: BasicComponent,
    data: { title: 'Basic Tables' },
  },
  {
    path: 'data-table',
    component: DataTableComponent,
    data: { title: 'Data Tables' },
  },
]
