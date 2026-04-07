import { CommonModule } from '@angular/common'
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  TemplateRef,
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import {
  NgbDropdownModule,
  NgbPaginationModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap'
import { InvestmentService } from '@core/services/investment.service'
import { Investment } from '@core/models/investment.model'
import { Router } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'investment-data',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbPaginationModule,
    NgbDropdownModule,
    TranslateModule,
  ],
  templateUrl: './investment-data.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InvestmentDataComponent implements OnInit {
  document = document

  investments: Investment[] = []
  paginatedInvestments: Investment[] = []
  page = 1
  pageSize = 5
  collectionSize = 0
  currency = 'SAR'
  searchText = ''
  selectedInvestment: Investment | null = null

  constructor(
    private investmentService: InvestmentService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInvestments()
  }

  loadInvestments() {
    this.investmentService.getAllInvestments().subscribe({
      next: (data: Investment[]) => {
        this.investments = data.filter((inv) => inv.property !== null)
        this.collectionSize = this.investments.length
        this.refreshInvestments()
      },
      error: (err: unknown) => {
        console.error('Error loading investments', err)
      },
    })
  }

  refreshInvestments() {
    const start = (this.page - 1) * this.pageSize
    const end = start + this.pageSize
    this.paginatedInvestments = this.investments.slice(start, end)
  }

  filterInvestments() {
    const filtered = this.investments.filter((item: Investment) =>
      item.property?.name?.toLowerCase().includes(this.searchText.toLowerCase())
    )
    this.collectionSize = filtered.length
    const start = (this.page - 1) * this.pageSize
    this.paginatedInvestments = filtered.slice(start, start + this.pageSize)
  }

  formatDate(date: string | undefined): string {
    return date ? new Date(date).toLocaleDateString() : ''
  }

  getTranslatedType(type?: string): string {
    const t = type ?? '' 
    switch (t) {
      case 'available':
        return 'PROPERTYADD.TYPE_AVAILABLE'
      case 'completed':
        return 'PROPERTYADD.TYPE_COMPLETED'
      case 'exit':
        return 'PROPERTYADD.TYPE_EXIT'
      default:
        return 'PROPERTYADD.TYPE_UNKNOWN'
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'badge bg-success'
      case 'pending':
        return 'badge bg-warning'
      case 'exited':
      case 'closed':
        return 'badge bg-danger'
      default:
        return 'badge bg-secondary'
    }
  }

  openInvestmentModal(modal: TemplateRef<unknown>, item: Investment) {
    this.selectedInvestment = item
    this.modalService.open(modal, { size: 'lg', centered: true })
  }

  viewInvestmentDetails(id: string) {
    this.router.navigate(['/investments', id])
  }
}
