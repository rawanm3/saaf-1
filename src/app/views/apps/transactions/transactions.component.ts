import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { TransactionService } from '@core/services/transaction.service'
import {
  NgbDropdownModule,
  NgbPaginationModule,
  NgbModal,
  NgbModalModule,
} from '@ng-bootstrap/ng-bootstrap'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { TransactionType } from './data'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [
    CommonModule,
    PageTitleComponent,
    NgbPaginationModule,
    NgbDropdownModule,
    NgbModalModule,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './transactions.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TransactionsComponent {
  Math = Math

  transactionList: TransactionType[] = []
  filteredTransactions: TransactionType[] = []
  page: number = 1
  pageSize: number = 10
  collectionSize: number = 0

  get paginatedTransactions(): TransactionType[] {
    const start = (this.page - 1) * this.pageSize
    const end = start + this.pageSize
    return this.filteredTransactions.slice(start, end)
  }

  stateList = [
    {
      title: 'Total Transactions',
      amount: '0',
      icon: 'solar:exchange-dollar-broken',
      change: 0,
      variant: 'success',
    },
    {
      title: 'Total Amount',
      amount: '$0',
      icon: 'solar:money-bag-bold',
      change: 0,
      variant: 'primary',
    },
  ]

  searchText: string = ''
  selectedTransaction: TransactionType | null = null

  private searchTimeout: any

  constructor(
    private modalService: NgbModal,
    private transactionService: TransactionService
  ) {
    this.loadTransactions()
  }
  refreshTransactions() {
    this.collectionSize = this.filteredTransactions.length
    if ((this.page - 1) * this.pageSize >= this.collectionSize) {
      this.page = 1
    }
  }

  getTypeKey(type: string): string {
    return type ? 'TRANSACTIONS.TYPE_VALUES.' + type : 'TRANSACTIONS.NA'
  }
  

  getStatusKey(status: string): string {
    return status ? 'TRANSACTIONS.STATUS_VALUES.' + status : 'TRANSACTIONS.NA'
  }

  loadTransactions() {
    this.transactionService.getAllTransactions().subscribe({
      next: (transactions) => {
        this.transactionList = transactions
        this.filteredTransactions = [...transactions]
        this.refreshTransactions()
        this.transactionService.setTransactions(transactions)
        this.stateList[0].amount = transactions.length.toString()
        this.stateList[1].amount = `$${transactions.reduce(
          (sum, t) => sum + (t.amount || 0),
          0
        )}`
      },
      error: (err) => {
        this.transactionList = []
        this.filteredTransactions = []
        this.transactionService.setTransactions([])
      },
    })
  }

  filterTransactions() {
    clearTimeout(this.searchTimeout)
    this.searchTimeout = setTimeout(() => {
      const search = this.searchText.toLowerCase().trim()
      if (search) {
        this.filteredTransactions = this.transactionList.filter(
          (t) =>
            (t.user.name || '').toLowerCase().includes(search) ||
            (t.type || '').toLowerCase().includes(search) ||
            (t.status || '').toLowerCase().includes(search) ||
            (t.agentName || '').toLowerCase().includes(search)
        )
      } else {
        this.filteredTransactions = [...this.transactionList]
        this.refreshTransactions()
      }
    }, 300)
  }

  openTransactionModal(tpl: any, transaction: TransactionType) {
    this.selectedTransaction = { ...transaction }
    this.modalService.open(tpl, { size: 'lg', centered: true })
  }
}
