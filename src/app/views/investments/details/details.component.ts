import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { InvestmentInfoComponent } from './components/investment-info/investment-info.component'
import { InvestmentService } from '@core/services/investment.service'
import { Investment } from '@core/models/investment.model'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-investment-details',
  standalone: true,
  imports: [CommonModule, RouterModule, InvestmentInfoComponent],
  templateUrl: './details.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InvestmentDetailsComponent implements OnInit {
  investment: Investment | null = null
  isLoading: boolean = true

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private investmentService: InvestmentService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id')
      if (id) {
        this.loadInvestment(id)
      }
    })
  }

  loadInvestment(id: string): void {
    this.isLoading = true
    this.investmentService.getInvestmentById(id).subscribe({
      next: (res: Investment | null) => {
        if (res) {
          this.investment = res
        } else {
          console.warn('Investment not found')
        }
        this.isLoading = false
      },
      error: (err: unknown) => {
        console.error('Error loading investment:', err)
        this.isLoading = false
      },
    })
  }

  goBack(): void {
    this.router.navigate(['/investments'])
  }

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
