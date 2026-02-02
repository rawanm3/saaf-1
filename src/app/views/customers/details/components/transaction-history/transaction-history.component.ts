import { Component, Input, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { Subscription } from 'rxjs'
import { TranslateModule } from '@ngx-translate/core'
import { CustomersService } from '@core/services/customers.service'

@Component({
  selector: 'customer-transaction-history',
  standalone: true,
  imports: [NgbPaginationModule, NgbDropdownModule, CommonModule, TranslateModule],
  templateUrl: './transaction-history.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TransactionHistoryComponent implements OnInit, OnDestroy {
  @Input() userId!: string

  transactionList: any[] = []
  allTransactions: any[] = []
  isLoading = false
  errorMessage = ''
  private subscription?: Subscription
  currentFilter: 'all' | 'month' | 'last3' | 'last12' = 'all'
  page = 1
  pageSize = 10

  get pagedTransactions() {
    const start = (this.page - 1) * this.pageSize
    return this.transactionList.slice(start, start + this.pageSize)
  }

  constructor(private customerService: CustomersService) {}

  ngOnInit(): void {
    if (this.userId) this.loadTransactions()
  }

  ngOnChanges(): void {
    if (this.userId) this.loadTransactions()
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe()
  }

  // 🟢 دالة لتطبيع الحالات (من غير ما نغير الباك)
  normalizeStatus(status: string): string {
    const s = (status || '').toLowerCase()
    switch (s) {
      case 'succeeded':
        return 'completed'
      case 'cancelled':
      case 'rejected':
        return 'rejected'
      case 'pending':
      case 'completed':
      case 'failed':
        return s
      default:
        return 'failed'
    }
  }

  private loadTransactions(): void {
    if (!this.userId) {
      this.errorMessage = 'User ID is required to load transactions'
      return
    }

    this.isLoading = true
    this.errorMessage = ''
    this.transactionList = []

    this.subscription = this.customerService.getUserTransactions(this.userId).subscribe({
      next: (transactions: any[]) => {
        const mapped = (transactions || []).map((t: any) => {
          const date = this.parseDateFlexible(t.createdAt ?? t.date ?? t.transactionDate)
          const typeRaw = (t.type ?? '').toString()
          const type = typeRaw || '-'

          const prop =
            t.property ??
            t.realestate ??
            t.asset ??
            t.prop ??
            t.propertyInfo ??
            t.propertyDetails ??
            {}
          const cityRegionCountry = [prop.city, prop.region, prop.country].filter(Boolean).join(', ')
          const resolvedAddress =
            prop.address?.full ??
            prop.location?.full ??
            prop.fullAddress ??
            prop.addressLine ??
            prop.address1 ??
            prop.streetAddress ??
            prop.address ??
            prop.location ??
            (cityRegionCountry || null) ??
            t.propertyAddress ??
            t.property_address ??
            t.propertyLocation ??
            t.location ??
            t.address ??
            t.referenceId ??
            '-'
          const isDeposit = typeRaw.toLowerCase() === 'deposit'
          const address = isDeposit ? '-' : resolvedAddress

          const amount = typeof t.amount === 'number' ? t.amount : Number(t.amount) || 0
          const currency = t.currency || 'SAR'

          const customer =
            t.userId?.name?.en ||
            t.userId?.name?.ar ||
            t.userId?.name ||
            t.userName ||
            t.customerName ||
            t.userId?.email ||
            t.userEmail ||
            '-'

          // 🟣 استخدام الدالة هنا
          const status = this.normalizeStatus(t.status)

          return {
            order_id: t._id || t.id || '-',
            date,
            type,
            address,
            amount,
            status,
            customer,
            currency,
          }
        })
        this.allTransactions = mapped
        this.applyFilter()
        this.isLoading = false
      },
      error: (error: any) => {
        console.error(' loading transaction history:', error)
        this.errorMessage = `Failed to load transaction history: ${error.message || 'Unknown error'}`
        this.isLoading = false
        this.transactionList = []
      },
    })
  }

  applyFilter(): void {
    const now = new Date()
    if (this.currentFilter === 'all') {
      this.transactionList = this.allTransactions
      return
    }
    const monthsBack =
      this.currentFilter === 'month' ? 0 : this.currentFilter === 'last3' ? 3 : 12
    const cutoff =
      this.currentFilter === 'month'
        ? new Date(now.getFullYear(), now.getMonth(), 1)
        : new Date(now.getFullYear(), now.getMonth() - monthsBack, now.getDate())

    this.transactionList = this.allTransactions.filter((t: any) => {
      const d = t.date instanceof Date ? t.date : this.parseDateFlexible(t.date)
      if (!(d instanceof Date) || isNaN(d as any)) return false
      return d >= cutoff
    })
  }

  private parseDateFlexible(value: any): Date | null {
    if (!value) return null
    if (value instanceof Date) return isNaN(value as any) ? null : value
    if (typeof value === 'number') return new Date(value)
    if (typeof value !== 'string') return null

    const native = new Date(value)
    if (!isNaN(native as any)) return native

    const ddmmyyyy = /^(\d{2})[\/\-](\d{2})[\/\-](\d{4})(.*)$/
    const m = value.match(ddmmyyyy)
    if (m) {
      const day = m[1],
        month = m[2],
        year = m[3]
      const rest = m[4] || ''
      const iso = `${year}-${month}-${day}${rest}`
      const d2 = new Date(iso)
      if (!isNaN(d2 as any)) return d2
    }

    const mmddyyyy = /^(\d{2})[\/\-](\d{2})[\/\-](\d{4})(.*)$/
    const n = value.match(mmddyyyy)
    if (n) {
      const month = n[1],
        day = n[2],
        year = n[3]
      const rest = n[4] || ''
      const iso = `${year}-${month}-${day}${rest}`
      const d3 = new Date(iso)
      if (!isNaN(d3 as any)) return d3
    }

    return null
  }

  trackByIndex = (_: number, __: any) => _

  retryLoad(): void {
    this.loadTransactions()
  }
}
