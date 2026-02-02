import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { WalletService } from '@core/services/wallet.service'
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap'
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
  user: User
}

interface User {
  name: string
  email: string
  iban: string
}

@Component({
  selector: 'app-wallet-list',
  standalone: true,
  imports: [
    NgbPagination,
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
  deposits: PendingPayment[] = []
  withdrawals: PendingPayment[] = []
  activeTab: 'deposit' | 'withdraw' = 'deposit'

  paginatedList: PendingPayment[] = []
  page = 1
  pageSize = 10
  collectionSize = 0
  loading = false

  showEditModal = false
  selectedPayment: PendingPayment | null = null
  updatedAmount: number | null = null

  constructor(
    private walletService: WalletService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadPendingPayments()
  }

  loadPendingPayments(): void {
    this.loading = true
    this.walletService.getPendingPayments().subscribe({
      next: (res: any) => {
        this.deposits = res.pendingDeposits || []
        this.withdrawals = res.pendingWithdraws || []
        this.refreshList()
        this.loading = false
      },
      error: (err: any) => {
        console.error(err)
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
    this.paginatedList = list.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    )
  }

  setActiveTab(tab: 'deposit' | 'withdraw'): void {
    this.activeTab = tab
    this.page = 1
    this.refreshList()
  }

  approve(paymentId: string): void {
    const isDeposit = this.activeTab === 'deposit'
    const apiCall = isDeposit
      ? this.walletService.approveDeposit(paymentId)
      : this.walletService.approveWithdraw(paymentId)

    apiCall.subscribe({
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
      error: (err: any) => {
        console.error(err)
        Swal.fire(
          this.translate.instant('WALLET.ERROR_TITLE'),
          this.translate.instant('WALLET.ERROR_APPROVE'),
          'error'
        )
      },
    })
  }

  reject(paymentId: string): void {
    const isDeposit = this.activeTab === 'deposit'
    const apiCall = isDeposit
      ? this.walletService.rejectDeposit(paymentId, 'Rejected by admin')
      : this.walletService.rejectWithdraw(paymentId, 'Rejected by admin')

    apiCall.subscribe({
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
      error: (err: any) => {
        console.error(err)
        Swal.fire(
          this.translate.instant('WALLET.ERROR_TITLE'),
          this.translate.instant('WALLET.ERROR_REJECT'),
          'error'
        )
        this.refreshList()
      },
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

    const updatedData = { amount: updatedValue }

    this.walletService.updateAmount(paymentId, updatedData).subscribe({
      next: () => {
        const list =
          this.activeTab === 'deposit' ? this.deposits : this.withdrawals
        const index = list.findIndex((w) => w._id === this.selectedPayment?._id)
        if (index !== -1) {
          list[index].amount = updatedValue
        }

        Swal.fire(
          this.translate.instant('WALLET.UPDATED_TITLE'),
          this.translate.instant('WALLET.UPDATED_MSG'),
          'success'
        )
        this.closeModal()
      },
      error: (err: any) => {
        console.error('API Error:', err)
        Swal.fire(
          this.translate.instant('WALLET.ERROR_TITLE'),
          this.translate.instant('WALLET.ERROR_UPDATE'),
          'error'
        )
      },
    })
  }
}
