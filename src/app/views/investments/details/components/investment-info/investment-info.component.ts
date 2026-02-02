import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { currency, currentYear } from '@common/constants'

@Component({
  selector: 'investment-info',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './investment-info.component.html',
  styleUrls: ['./investment-info.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InvestmentInfoComponent {
  @Input() investment: any

  currency = currency
  currentYear = currentYear

  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'badge bg-success'
      case 'pending':
        return 'badge bg-warning'
      case 'exited':
        return 'badge bg-secondary'
      case 'cancelled':
        return 'badge bg-danger'
      default:
        return 'badge bg-light'
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString()
  }
}
