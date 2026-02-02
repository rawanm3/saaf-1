import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { pricingData } from './data'
import { currency } from '@common/constants'

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [PageTitleComponent],
  templateUrl: './pricing.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PricingComponent {
  pricingData = pricingData
  currency = currency
}
