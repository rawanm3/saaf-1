import type { Route } from '@angular/router'
import { StarterComponent } from './starter/starter.component'
import { CalendarComponent } from './calendar/calendar.component'
import { InvoiceComponent } from './invoice/invoice.component'
import { FaqsComponent } from './faqs/faqs.component'
import { TimelineComponent } from './timeline/timeline.component'
import { PricingComponent } from './pricing/pricing.component'
import { Alt404Component } from './alt404/alt404.component'

export const PAGES_ROUTES: Route[] = [
  {
    path: 'starter',
    component: StarterComponent,
    data: { title: 'Welcome' },
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    data: { title: 'Schedule' },
  },
  {
    path: 'invoice',
    component: InvoiceComponent,
    data: { title: 'Invoice Details' },
  },
  {
    path: 'faqs',
    component: FaqsComponent,
    data: { title: 'FAQs' },
  },
  {
    path: 'timeline',
    component: TimelineComponent,
    data: { title: 'Timeline' },
  },
  {
    path: 'pricing',
    component: PricingComponent,
    data: { title: 'Pricing' },
  },
  {
    path: '404-alt',
    component: Alt404Component,
    data: { title: '404 Alt' },
  },
]
