import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { StatisticsComponent } from './components/statistics/statistics.component'
import { SalesChartComponent } from './components/sales-chart/sales-chart.component'
import { BalanceCardComponent } from './components/balance-card/balance-card.component'
import { WeeklySalesComponent } from './components/weekly-sales/weekly-sales.component'
import { currency } from '@common/constants'
import { TranslateService } from '@ngx-translate/core'
import {
  InvestmentSummary,
  PropertyProgress,
  Transaction,
  Wallet,
  PendingInvestment,
} from '@core/models/dashboard.model'
import { DashboardService } from '@core/services/dashboard.service'
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'
import Swal from 'sweetalert2'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    PageTitleComponent,
    StatisticsComponent,
    SalesChartComponent,
    BalanceCardComponent,
    WeeklySalesComponent,
    CommonModule,
    NgbPaginationModule,
    DatePipe,
    TranslateModule,
  ],
  templateUrl: './analytics.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AnalyticsComponent implements OnInit {
  investmentsSummary!: InvestmentSummary
  propertyProgress!: PropertyProgress[]
  transactionsDashboard!: Transaction[]
  walletsDashboard!: Wallet[]
  pendingInvestments: PendingInvestment[] = []
  propertiesCount: number = 0
  customersCount: number = 0
  loading: boolean = true
  page = 1
  pageSize = 5

  get pagedPendingInvestments() {
    const start = (this.page - 1) * this.pageSize
    return this.pendingInvestments.slice(start, start + this.pageSize)
  }
  currency = currency

  constructor(
    private dashboardService: DashboardService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadDashboard()
  }

  loadDashboard() {
    this.loading = true

    this.dashboardService.getInvestmentsSummary().subscribe((data) => {
      this.investmentsSummary = data
    })

    this.dashboardService.getPropertiesProgress().subscribe((data) => {
      this.propertyProgress = data
    })

    this.dashboardService.getTransactionsDashboard().subscribe((data) => {
      this.transactionsDashboard = data
    })

    this.dashboardService.getWalletsDashboard().subscribe((data) => {
      this.walletsDashboard = data
    })

    this.dashboardService.getPendingInvestments().subscribe((res) => {
      this.pendingInvestments = res.data || [] 
    })

    this.dashboardService.getPropertiesCount().subscribe((data) => {
      this.propertiesCount = data.count
    })

    this.dashboardService.getCustomersCount().subscribe((data) => {
      this.customersCount = data.count
    })

    setTimeout(() => {
      this.loading = false
    }, 1000)
  }

  approve(inv: PendingInvestment) {
    this.translate
      .get([
        'CONFIRM.APPROVE_TITLE',
        'CONFIRM.APPROVE_TEXT',
        'CONFIRM.YES_APPROVE',
        'CONFIRM.CANCEL',
        'SUCCESS.APPROVED_TITLE',
        'SUCCESS.APPROVED_TEXT',
        'ERROR.TITLE',
        'ERROR.TEXT',
      ])
      .subscribe((translations) => {
        Swal.fire({
          title: translations['CONFIRM.APPROVE_TITLE'],
          text: translations['CONFIRM.APPROVE_TEXT'],
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: translations['CONFIRM.YES_APPROVE'],
          cancelButtonText: translations['CONFIRM.CANCEL'],
          confirmButtonColor: '#198754',
          cancelButtonColor: '#dc3545',
        }).then((result) => {
          if (result.isConfirmed) {
            this.dashboardService.approveInvestment(inv._id).subscribe({
              next: () => {
                Swal.fire({
                  title: translations['SUCCESS.APPROVED_TITLE'],
                  text: translations['SUCCESS.APPROVED_TEXT'],
                  icon: 'success',
                  timer: 2000,
                  showConfirmButton: false,
                })
                this.loadDashboard()
              },
              error: () => {
                Swal.fire({
                  title: translations['ERROR.TITLE'],
                  text: translations['ERROR.TEXT'],
                  icon: 'error',
                })
              },
            })
          }
        })
      })
  }

  reject(inv: PendingInvestment) {
    this.translate
      .get([
        'CONFIRM.REJECT_TITLE',
        'CONFIRM.REJECT_TEXT',
        'CONFIRM.YES_REJECT',
        'CONFIRM.CANCEL',
        'SUCCESS.REJECTED_TITLE',
        'SUCCESS.REJECTED_TEXT',
        'ERROR.TITLE',
        'ERROR.TEXT',
      ])
      .subscribe((translations) => {
        Swal.fire({
          title: translations['CONFIRM.REJECT_TITLE'],
          text: translations['CONFIRM.REJECT_TEXT'],
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: translations['CONFIRM.YES_REJECT'],
          cancelButtonText: translations['CONFIRM.CANCEL'],
          confirmButtonColor: '#dc3545',
          cancelButtonColor: '#6c757d',
        }).then((result) => {
          if (result.isConfirmed) {
            this.dashboardService.rejectInvestment(inv._id).subscribe({
              next: () => {
                Swal.fire({
                  title: translations['SUCCESS.REJECTED_TITLE'],
                  text: translations['SUCCESS.REJECTED_TEXT'],
                  icon: 'success',
                  timer: 2000,
                  showConfirmButton: false,
                })
                this.loadDashboard()
              },
              error: () => {
                Swal.fire({
                  title: translations['ERROR.TITLE'],
                  text: translations['ERROR.TEXT'],
                  icon: 'error',
                })
              },
            })
          }
        })
      })
  }
}
