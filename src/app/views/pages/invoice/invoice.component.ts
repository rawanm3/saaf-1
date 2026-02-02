import { Component } from '@angular/core'
import { currency, currentYear } from '@common/constants'
import { PageTitleComponent } from '@component/page-title.component'

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [PageTitleComponent],
  templateUrl: './invoice.component.html',
  styles: ``,
})
export class InvoiceComponent {
  currency = currency
  currentYear = currentYear
}
