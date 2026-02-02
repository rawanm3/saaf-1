import { Component, OnInit } from '@angular/core'
import type { ChartOptions } from '@common/apexchart.model'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { NgApexchartsModule } from 'ng-apexcharts'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { DashboardService } from '@core/services/dashboard.service'
import { currency } from '@common/constants'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'analytics-sales-chart',
  standalone: true,
  imports: [
    NgApexchartsModule,
    NgbDropdownModule,
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './sales-chart.component.html',
  styles: ``,
})
export class SalesChartComponent implements OnInit {
  currency = currency

  investmentsAnalytics: any
  salesAnalyticChart: any = {
    series: [],
    chart: { type: 'line', height: 350 },
    labels: [],
    colors: ['#00c853', '#d50000'],
    stroke: { curve: 'smooth' },
  }

  selectedPeriod: 'week' | 'month' = 'month'
  selectedPeriodLabel: string = 'ANALYTICS.THIS_MONTH'

  constructor(
    private dashboardService: DashboardService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadAnalytics(this.selectedPeriod)
  }

  loadAnalytics(period: 'week' | 'month') {
    this.selectedPeriod = period
    this.selectedPeriodLabel =
      period === 'week' ? 'ANALYTICS.WEEK' : 'ANALYTICS.THIS_MONTH'

   this.dashboardService.getInvestmentsAnalytics(period).subscribe((data) => {
  this.investmentsAnalytics = data

  const cleanNumber = (val: any): number => {
    if (val === null || val === undefined) return 0
    const numeric = String(val).replace(/[^\d.-]/g, '')
    return isFinite(Number(numeric)) ? Number(numeric) : 0
  }

  const chartData = Array.isArray(data?.chartData) ? data.chartData : []

  if (!chartData.length) {
    this.salesAnalyticChart = {
      chart: { type: 'line', height: 350, toolbar: { show: false } },
      series: [],
      xaxis: { categories: [] },
      colors: ['#3a5445', '#c8a877'],
      stroke: { curve: 'smooth' },
    }
    return
  }

  const cleanedData = chartData.map((d: any) => ({
    label: d?.label ?? '',
    income: cleanNumber(d?.income),
    expense: cleanNumber(d?.expense),
  }))

  this.translate
    .stream(['ANALYTICS.INCOME', 'ANALYTICS.EXPENSES'])
    .subscribe((translations) => {
      this.salesAnalyticChart = {
        chart: { type: 'line', height: 350, toolbar: { show: false } },
        series: [
          {
            name: translations['ANALYTICS.INCOME'],
            data: cleanedData.map((d) => d.income),
          },
          {
            name: translations['ANALYTICS.EXPENSES'],
            data: cleanedData.map((d) => d.expense),
          },
        ],
        xaxis: { categories: cleanedData.map((d) => d.label) },
        colors: ['#3a5445', '#c8a877'],
        stroke: { curve: 'smooth' },
        tooltip: {
          y: {
            formatter: (val: number) =>
              `${val.toLocaleString()} ${this.currency}`,
          },
        },
      }
    })
})

  }
}
