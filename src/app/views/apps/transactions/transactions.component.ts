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
import { TranslateModule, TranslateService } from '@ngx-translate/core'

export type TabType = 'all' | 'deposit' | 'withdraw' | 'master' | 'distribution'

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
  startDate: string = ''
  endDate: string = ''

  // ─── كل التراكنشنز مدمجة ───
  allTransactions: TransactionType[] = []      // all + master مدمجين بدون تكرار
  filteredTransactions: TransactionType[] = []

  masterWalletInfo: any = null
  isMasterLoading = false
  isGeneratingPDF = false  // ✅ مؤشر تحميل PDF

  // ─── Tabs ───
  activeTab: TabType = 'all'

  tabs: { key: TabType; labelKey: string; icon: string; types?: string[] }[] = [
    { key: 'all',          labelKey: 'TRANSACTIONS.TAB_ALL',          icon: 'solar:list-bold-duotone' },
    { key: 'deposit',      labelKey: 'TRANSACTIONS.TAB_DEPOSIT',      icon: 'solar:wallet-money-bold-duotone',  types: ['deposit'] },
    { key: 'withdraw',     labelKey: 'TRANSACTIONS.TAB_WITHDRAW',     icon: 'solar:card-send-bold-duotone',     types: ['withdraw'] },
    { key: 'master',       labelKey: 'TRANSACTIONS.TAB_MASTER',       icon: 'solar:safe-bold-duotone',          types: ['master-deposit', 'master-withdraw'] },
    { key: 'distribution', labelKey: 'TRANSACTIONS.TAB_DISTRIBUTION', icon: 'solar:hand-money-bold-duotone',   types: ['distribution', 'master-distribution', 'transfer'] },
  ]

  // ─── Pagination ───
  page = 1
  pageSize = 10
  collectionSize = 0

  get paginatedTransactions(): TransactionType[] {
    const start = (this.page - 1) * this.pageSize
    return this.filteredTransactions.slice(start, start + this.pageSize)
  }

  // ─── Stats (مفاتيح ترجمة بدل نص ثابت) ───
  stateList = [
    {
      titleKey: 'TRANSACTIONS.TOTAL_TRANSACTIONS',
      amount: '0',
      icon: 'solar:exchange-dollar-broken',
      variant: 'success',
    },
    {
      titleKey: 'TRANSACTIONS.TOTAL_AMOUNT',
      amount: '0 SAR',
      icon: 'solar:money-bag-bold',
      variant: 'primary',
    },
    {
      titleKey: 'TRANSACTIONS.MASTER_WALLET_BALANCE',
      amount: '— SAR',
      icon: 'solar:safe-bold',
      variant: 'warning',
    },
  ]

  searchText = ''
  selectedTransaction: TransactionType | null = null
  private searchTimeout: any

  constructor(
    private modalService: NgbModal,
    private transactionService: TransactionService,
    private translate: TranslateService
  ) {
    this.loadAll()
  }

  // ─── تحميل الكل — getAllTransactions بتعمل دمج تلقائي مع master ───
  loadAll() {
    this.isMasterLoading = true

    // 1️⃣ تحميل كل الترانزاكشنز
    this.transactionService.getAllTransactions().subscribe({
      next: (merged) => {
        this.allTransactions = merged
        this.transactionService.setTransactions(merged)
        this.applyTabFilter()
        this.updateStats()
      },
      error: () => {
        this.allTransactions = []
        this.applyTabFilter()
      },
    })

    // 2️⃣ تحميل master wallet
    this.transactionService.getMasterWalletTransactions().subscribe({
      next: (res) => {
        this.masterWalletInfo = res.masterWallet
        this.updateStats()
        this.isMasterLoading = false
      },
      error: () => {
        this.isMasterLoading = false
      },
    })
  }

  // ─── Tab switch ───
  switchTab(tab: TabType) {
    this.activeTab = tab
    this.searchText = ''
    this.page = 1
    this.applyTabFilter()
  }

  // ─── فلتر حسب التاب من allTransactions ───
  applyTabFilter() {
    if (this.activeTab === 'all') {
      this.filteredTransactions = [...this.allTransactions]
    } else {
      const tab = this.tabs.find((t) => t.key === this.activeTab)
      if (tab?.types) {
        this.filteredTransactions = this.allTransactions.filter((t) =>
          tab.types!.includes(t.type)
        )
      } else {
        this.filteredTransactions = [...this.allTransactions]
      }
    }
    this.refreshTransactions()
  }

  // ─── Search ───
  filterTransactions() {
    clearTimeout(this.searchTimeout)
    this.searchTimeout = setTimeout(() => {
      const search = this.searchText.toLowerCase().trim()
      if (search) {
        const base = this.getBaseForCurrentTab()
        this.filteredTransactions = base.filter(
          (t) =>
            (t.user?.name || '').toLowerCase().includes(search) ||
            (t.type || '').toLowerCase().includes(search) ||
            (t.status || '').toLowerCase().includes(search) ||
            (t.notes || '').toLowerCase().includes(search) ||
            (t.agentName || '').toLowerCase().includes(search)
        )
      } else {
        this.applyTabFilter()
      }
      this.refreshTransactions()
    }, 300)
  }

  private getBaseForCurrentTab(): TransactionType[] {
    if (this.activeTab === 'all') return [...this.allTransactions]
    const tab = this.tabs.find((t) => t.key === this.activeTab)
    if (tab?.types) {
      return this.allTransactions.filter((t) => tab.types!.includes(t.type))
    }
    return [...this.allTransactions]
  }

  // ─── Helpers ───
  refreshTransactions() {
    this.collectionSize = this.filteredTransactions.length
    if (this.collectionSize > 0 && (this.page - 1) * this.pageSize >= this.collectionSize) {
      this.page = 1
    }
  }

  updateStats() {
    const all = this.allTransactions

    // عدد العمليات
    this.stateList[0].amount = all.length.toString()

    // إجمالي المبالغ
    const total = all.reduce((sum, t) => sum + (t.amount || 0), 0)
    this.stateList[1].amount = `${total.toLocaleString()} SAR`

    // رصيد الماستر (من state مش من res)
    const balanceSAR = this.masterWalletInfo?.balances?.total ?? 0
    this.stateList[2].amount = `${balanceSAR.toLocaleString()} SAR`
  }

  // ✅ إنشاء وفتح PDF مباشرة
  generateAndViewPDF() {
    this.isGeneratingPDF = true

    this.transactionService
      .generateTransactionsPDF(this.startDate, this.endDate)
      .subscribe({
        next: (fileUrl: string) => {
          this.isGeneratingPDF = false

          if (fileUrl) {
            // استخراج اسم الملف من الرابط
            const filename = fileUrl.split('/').pop()

            if (filename) {
              // فتح PDF في تبويب جديد
              this.transactionService.openPDFInNewTab(filename)
            } else {
              // إذا لم نستطع استخراج الاسم، نفتح الرابط مباشرة
              window.open(fileUrl, '_blank')
            }
          } else {
            console.error('لم يتم استلام رابط الملف')
            this.showError('حدث خطأ في إنشاء التقرير')
          }
        },
        error: (err) => {
          this.isGeneratingPDF = false
          console.error('Error generating PDF:', err)
          this.showError('حدث خطأ أثناء إنشاء التقرير')
        }
      })
  }

  // ✅ تحميل PDF (اختياري)
  downloadPDF() {
    this.isGeneratingPDF = true

    this.transactionService
      .generateTransactionsPDF(this.startDate, this.endDate)
      .subscribe({
        next: (fileUrl: string) => {
          this.isGeneratingPDF = false

          if (fileUrl) {
            const filename = fileUrl.split('/').pop()

            if (filename) {
              // تحميل الملف باسم مخصص
              const dateRange = this.getDateRangeLabel()
              this.transactionService.downloadPDFWithCustomName(
                filename,
                `تقرير_المعاملات_${dateRange}`
              )
            } else {
              // طريقة بديلة للتحميل
              const link = document.createElement('a')
              link.href = fileUrl
              link.download = 'transactions-report.pdf'
              link.click()
            }
          } else {
            this.showError('حدث خطأ في إنشاء التقرير')
          }
        },
        error: (err) => {
          this.isGeneratingPDF = false
          console.error('Error generating PDF:', err)
          this.showError('حدث خطأ أثناء إنشاء التقرير')
        }
      })
  }

  // ✅ الحصول على تسمية نطاق التاريخ
  private getDateRangeLabel(): string {
    if (this.startDate && this.endDate) {
      return `${this.startDate}_to_${this.endDate}`
    } else if (this.startDate) {
      return `from_${this.startDate}`
    } else if (this.endDate) {
      return `until_${this.endDate}`
    }
    return 'all_transactions'
  }

  // ✅ عرض رسالة خطأ (يمكنك تخصيصها حسب نظام الـ UI الخاص بك)
  private showError(message: string) {
    // يمكنك استخدام Toastr, SweetAlert, أو أي نظام إشعارات
    console.error(message)
    alert(message) // مؤقتاً
  }

  getTypeKey(type: string): string {
    return type ? 'TRANSACTIONS.TYPE_VALUES.' + type : 'TRANSACTIONS.NA'
  }

  getStatusKey(status: string): string {
    return status ? 'TRANSACTIONS.STATUS_VALUES.' + status : 'TRANSACTIONS.NA'
  }

  getTabCount(tabKey: TabType): number {
    if (tabKey === 'all') return this.allTransactions.length
    const tab = this.tabs.find((t) => t.key === tabKey)
    if (tab?.types) {
      return this.allTransactions.filter((t) => tab.types!.includes(t.type)).length
    }
    return 0
  }

  openTransactionModal(tpl: any, transaction: TransactionType) {
    this.selectedTransaction = { ...transaction }
    this.modalService.open(tpl, { size: 'lg', centered: true })
  }

  get masterWalletBalance(): string {
    if (!this.masterWalletInfo) return '—'
    const sar = this.masterWalletInfo.balances?.total ?? 0
    return `${sar.toLocaleString()} SAR`
  }
}
