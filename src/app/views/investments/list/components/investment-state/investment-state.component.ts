import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DashboardService } from '@core/services/dashboard.service'
import type { InvestmentStatType } from '../../data'
import { TranslateModule } from '@ngx-translate/core'

interface InvestmentsSummary {
  totalInvestments: number
  activeInvestments: number
  pendingInvestments: number
  totalInvestedAmount: number | null | undefined
}

@Component({
  selector: 'investment-state',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './investment-state.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InvestmentStateComponent implements OnInit {
  stateList: InvestmentStatType[] = []
  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getInvestmentsSummary().subscribe({
      next: (data: InvestmentsSummary) => {
        this.stateList = [
          {
            title: 'INVESTMENT_STATE.TOTAL_INVESTMENTS',
            amount: `${data.totalInvestments}`,
            icon: 'mdi:finance',
            variant: 'primary',
            change: 0,
          },
          {
            title: 'INVESTMENT_STATE.ACTIVE_INVESTMENTS',
            amount: `${data.activeInvestments}`,
            icon: 'mdi:chart-line',
            variant: 'success',
            change: 0,
          },
          {
            title: 'INVESTMENT_STATE.PENDING_INVESTMENTS',
            amount: `${data.pendingInvestments}`,
            icon: 'mdi:timer-sand',
            variant: 'warning',
            change: 0,
          },
          {
            title: 'INVESTMENT_STATE.TOTAL_AMOUNT',
            amount:
              data.totalInvestedAmount != null
                ? `${data.totalInvestedAmount}`
                : '0',
            icon: 'mdi:cash',
            variant: 'info',
            change: 0,
          },
        ]
      },
      error: (err: unknown) => {
        console.error('Error fetching investments summary', err)
      },
    })
  }
}
