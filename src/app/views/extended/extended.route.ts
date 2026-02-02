import type { Route } from '@angular/router'
import { RatingsComponent } from './ratings/ratings.component'
import { SweetalertComponent } from './sweetalert/sweetalert.component'
import { SwiperSilderComponent } from './swiper-silder/swiper-silder.component'
import { ScrollbarComponent } from './scrollbar/scrollbar.component'
import { ToastifyComponent } from './toastify/toastify.component'

export const EXTENDED_ROUTES: Route[] = [
  {
    path: 'ratings',
    component: RatingsComponent,
    data: { title: 'Ratings' },
  },
  {
    path: 'sweet-alert',
    component: SweetalertComponent,
    data: { title: 'Sweet Alert' },
  },
  {
    path: 'swiper-slider',
    component: SwiperSilderComponent,
    data: { title: 'Swiper Slider' },
  },
  {
    path: 'scrollbar',
    component: ScrollbarComponent,
    data: { title: 'Scrollbar' },
  },
  {
    path: 'toastify',
    component: ToastifyComponent,
    data: { title: 'Toastify' },
  },
]
