import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core'
import type { ChartOptions } from '@common/apexchart.model'
import { NgApexchartsModule } from 'ng-apexcharts'
import { chartOptions } from '../../data'
import { CommonModule, DecimalPipe } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'analytics-statistics',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule, DecimalPipe, TranslateModule],
  templateUrl: './statistics.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StatisticsComponent {
  statisticData: Array<{ title: string; amount: string; icon: string; variant?: string }> = []

  totalCustomersChart = chartOptions
   @Input() investmentsSummary: any
  @Input() propertiesCount: number = 0
  @Input() customersCount: number = 0

  summaryData: any[] = []

  
  ngOnInit() {
    this.buildStats()
  }

  ngOnChanges() {
    this.buildStats()
  }

  private buildStats() {
    this.statisticData = [
  {
    title: 'ANALYTICS.TOTAL_INVESTMENTS',
    amount: String(this.investmentsSummary?.totalInvestments || 0),
    icon: 'mdi:finance',
    variant: 'false'
  },
  {
    title: 'ANALYTICS.TOTAL_INVESTED_AMOUNT',
    amount: String(this.investmentsSummary?.totalInvestedAmount || 0),
    icon: 'mdi:cash-multiple',
    variant: 'true',
    
  },
  {
    title: 'ANALYTICS.TOTAL_PROPERTIES',
    amount: String(this.propertiesCount),
    icon: 'mdi:home-city',
    variant: 'false',
    
  },
  {
    title: 'ANALYTICS.TOTAL_CUSTOMERS',
    amount: String(this.customersCount),
    icon: 'mdi:account-group',
    variant: 'false',
    
  },
]
  }
}
