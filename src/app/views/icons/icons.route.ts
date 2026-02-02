import type { Route } from '@angular/router'
import { RemixComponent } from './remix/remix.component'
import { SolarComponent } from './solar/solar.component'

export const ICONS_ROUTES: Route[] = [
  {
    path: 'remix',
    component: RemixComponent,
    data: { title: 'Remix Icons' },
  },
  {
    path: 'solar',
    component: SolarComponent,
    data: { title: 'Solar Icons' },
  },
]
