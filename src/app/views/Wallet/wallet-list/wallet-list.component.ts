import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { WalletService } from '@core/services/wallet.service'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { CommonModule } from '@angular/common'
import { PageTitleComponent } from '@component/page-title.component'
import { RouterModule } from '@angular/router'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { FormsModule } from '@angular/forms'
import Swal from 'sweetalert2'

export interface PendingPayment {
  _id?: string
  walletId: string
  paymentId: string
  amount: number
  currency: string
  status: string
  type: string
  createdAt: string
  referenceNumber: string
  sequenceNumber: string
  user: { name: string; email: string; iban: string }
}

@Component({
  selector: 'app-wallet-list',
  standalone: true,
  imports: [
    NgbPaginationModule,
    CommonModule,
    PageTitleComponent,
    RouterModule,
    TranslateModule,
    FormsModule,
  ],
  templateUrl: './Wallet-list.component.html',
  styleUrls: ['./Wallet-list.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WalletListComponent implements OnInit {

  // ─── Tabs ───
  activeTab: 'deposit' | 'withdraw' | 'pending-dist' = 'deposit'

  // ─── Deposit / Withdraw ───
  deposits: PendingPayment[] = []
  withdrawals: PendingPayment[] = []
  page = 1
  pageSize = 10
  collectionSize = 0
  loading = false

  // ─── Edit Modal ───
  showEditModal = false
  selectedPayment: PendingPayment | null = null
  updatedAmount: number | null = null

  // ─── Pending Distributions ───
  pendingDistributions: any[] = []
  pagedPendingDist: any[] = []
  pendingDistPage = 1
  pendingDistPageSize = 10
  pendingDistLoading = false

  constructor(
    private walletService: WalletService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadPendingPayments()
    // this.loadPendingDistributions()
  }

  // ─── Tab Switch ───
  setActiveTab(tab: typeof this.activeTab): void {
    this.activeTab = tab
    this.page = 1
    if (tab === 'deposit' || tab === 'withdraw') {
      this.refreshList()
    } else if (tab === 'pending-dist') {
      this.refreshPendingDist()
    }
  }

  // ─── Deposit / Withdraw ───
  loadPendingPayments(): void {
    this.loading = true
    this.walletService.getPendingPayments().subscribe({
      next: (res: any) => {
        this.deposits = res.pendingDeposits || []
        this.withdrawals = res.pendingWithdraws || []
        this.refreshList()
        this.loading = false
      },
      error: () => {
        this.loading = false
        Swal.fire(
          this.translate.instant('WALLET.ERROR_TITLE'),
          this.translate.instant('WALLET.ERROR_LOAD'),
          'error'
        )
      },
    })
  }

  refreshList(): void {
    const list = this.activeTab === 'deposit' ? this.deposits : this.withdrawals
    this.collectionSize = list.length
    const start = (this.page - 1) * this.pageSize
    this.paginatedList = list.slice(start, start + this.pageSize)
  }

  paginatedList: PendingPayment[] = []

  approve(paymentId: string): void {
    const isDeposit = this.activeTab === 'deposit'
    const call = isDeposit
      ? this.walletService.approveDeposit(paymentId)
      : this.walletService.approveWithdraw(paymentId)

    call.subscribe({
      next: () => {
        Swal.fire(
          this.translate.instant('WALLET.APPROVED_TITLE'),
          this.translate.instant('WALLET.APPROVED_MSG'),
          'success'
        )
        const list = isDeposit ? this.deposits : this.withdrawals
        const item = list.find((p) => p.paymentId === paymentId)
        if (item) item.status = 'succeeded'
        this.refreshList()
      },
      error: () =>
        Swal.fire(
          this.translate.instant('WALLET.ERROR_TITLE'),
          this.translate.instant('WALLET.ERROR_APPROVE'),
          'error'
        ),
    })
  }

  reject(paymentId: string): void {
    const isDeposit = this.activeTab === 'deposit'
    const call = isDeposit
      ? this.walletService.rejectDeposit(paymentId, 'Rejected by admin')
      : this.walletService.rejectWithdraw(paymentId, 'Rejected by admin')

    call.subscribe({
      next: () => {
        Swal.fire(
          this.translate.instant('WALLET.REJECTED_TITLE'),
          this.translate.instant('WALLET.REJECTED_MSG'),
          'info'
        )
        const list = isDeposit ? this.deposits : this.withdrawals
        const item = list.find((p) => p.paymentId === paymentId)
        if (item) item.status = 'rejected'
        this.refreshList()
      },
      error: () =>
        Swal.fire(
          this.translate.instant('WALLET.ERROR_TITLE'),
          this.translate.instant('WALLET.ERROR_REJECT'),
          'error'
        ),
    })
  }

  edit(record: PendingPayment): void {
    this.selectedPayment = { ...record }
    this.updatedAmount = record.amount
    this.showEditModal = true
  }

  closeModal(): void {
    this.showEditModal = false
    this.selectedPayment = null
    this.updatedAmount = null
  }

  saveAmount(): void {
    if (!this.selectedPayment) return
    const paymentId = this.selectedPayment._id || this.selectedPayment.paymentId
    const updatedValue = Number(this.updatedAmount)
    if (isNaN(updatedValue) || updatedValue <= 0) {
      Swal.fire(
        this.translate.instant('WALLET.INVALID_AMOUNT_TITLE'),
        this.translate.instant('WALLET.INVALID_AMOUNT_MSG'),
        'warning'
      )
      return
    }
    this.walletService.updateAmount(paymentId, { amount: updatedValue }).subscribe({
      next: () => {
        const list = this.activeTab === 'deposit' ? this.deposits : this.withdrawals
        const index = list.findIndex((w) => w._id === this.selectedPayment?._id)
        if (index !== -1) list[index].amount = updatedValue
        Swal.fire(
          this.translate.instant('WALLET.UPDATED_TITLE'),
          this.translate.instant('WALLET.UPDATED_MSG'),
          'success'
        )
        this.closeModal()
      },
      error: () =>
        Swal.fire(
          this.translate.instant('WALLET.ERROR_TITLE'),
          this.translate.instant('WALLET.ERROR_UPDATE'),
          'error'
        ),
    })
  }

  // ─── Pending Distributions ───
  // loadPendingDistributions(): void {
  //   this.pendingDistLoading = true
  //   this.walletService.getPendingDistributions().subscribe({
  //     next: (res: any) => {
  //       this.pendingDistributions = res.pendingDistributions || []
  //       this.pendingDistLoading = false
  //       this.refreshPendingDist()
  //     },
  //     error: () => {
  //       this.pendingDistLoading = false
  //     },
  //   })
  // }

  refreshPendingDist(): void {
    const start = (this.pendingDistPage - 1) * this.pendingDistPageSize
    this.pagedPendingDist = this.pendingDistributions.slice(
      start,
      start + this.pendingDistPageSize
    )
  }

  processDistribution(transactionId: string): void {
    this.walletService.updatePendingDistribution(transactionId).subscribe({
      next: () => {
        Swal.fire(
          this.translate.instant('WALLET.APPROVED_TITLE'),
          this.translate.instant('WALLET.APPROVED_MSG'),
          'success'
        )
        this.pendingDistributions = this.pendingDistributions.filter(
          (d) => d._id !== transactionId
        )
        this.refreshPendingDist()
      },
      error: (err: any) => {
        const msg = err?.error?.message || this.translate.instant('WALLET.ERROR_APPROVE')
        Swal.fire(this.translate.instant('WALLET.ERROR_TITLE'), msg, 'error')
      },
    })
  }
}