import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { orderData } from './dat'
import {
  NgbDropdownModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    PageTitleComponent,
    NgbDropdownModule,
    NgbPaginationModule,
    CommonModule,
  ],
  templateUrl: './orders.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OrdersComponent {
  orderList = orderData
}
