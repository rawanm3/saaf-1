import {
  Component,
  Directive,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChildren,
  type PipeTransform,
  type QueryList,
} from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component'
import { DataTableItems, paginateData, type DataTableItemsType } from './data'
import type { Observable } from 'rxjs'
import { NgbdSortableHeader } from '@core/directive/sortable.directive'
import { TableService } from '@core/services/table.service'
import { CommonModule, DecimalPipe } from '@angular/common'
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms'

export type SortColumn = keyof DataTableItemsType | ''
export type SortDirection = 'asc' | 'desc' | ''
const rotate: { [key: string]: SortDirection } = {
  asc: 'desc',
  desc: '',
  '': 'asc',
}

const compare = (v1: string | number, v2: string | number) =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0

export type CustomSortEvent = {
  column: SortColumn
  direction: SortDirection
}

@Directive({
  selector: 'th[sortable]',
  standalone: true,
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})
export class NgbdCustomSortableHeader {
  @Input() sortable: SortColumn = ''
  @Input() direction: SortDirection = ''
  @Output() sort = new EventEmitter<CustomSortEvent>()

  rotate() {
    this.direction = rotate[this.direction]
    this.sort.emit({ column: this.sortable, direction: this.direction })
  }
}

function search(text: string, pipe: PipeTransform): DataTableItemsType[] {
  return DataTableItems.filter((country) => {
    const term = text.toLowerCase()
    return (
      country.name.toLowerCase().includes(term) ||
      pipe.transform(country.area).includes(term) ||
      pipe.transform(country.population).includes(term)
    )
  })
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    PageTitleComponent,
    UIExamplesListComponent,
    NgbPaginationModule,
    CommonModule,
    FormsModule,
    NgbHighlight,
    NgbdSortableHeader,
  ],
  templateUrl: './data-table.component.html',
  styles: ``,
})
export class DataTableComponent {
  filter!: string

  page = 1
  pageSize = 4
  collectionSize = DataTableItems.length
  countries!: DataTableItemsType[]
  basicCountries = DataTableItems.slice(0, 5)
  searchCountries = DataTableItems.slice(0, 5)
  sortCountries = DataTableItems.slice(0, 5)

  records$: Observable<DataTableItemsType[]>
  total$: Observable<number>

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<
    NgbdSortableHeader<DataTableItemsType>
  >

  public tableService = inject(TableService<DataTableItemsType>)

  constructor(public pipe: DecimalPipe) {
    this.records$ = this.tableService.items$
    this.total$ = this.tableService.total$

    this.refreshCountries()
  }

  ngOnInit(): void {
    this.tableService.setItems(DataTableItems, 5)
  }

  onSort({ column, direction }: CustomSortEvent) {
    for (const header of this.headers) {
      if (header.sortable !== column) {
        header.direction = ''
      }
    }
    if (direction === '' || column === '') {
      this.sortCountries = DataTableItems
    } else {
      this.sortCountries = [...DataTableItems].sort((a, b) => {
        const res = compare(a[column], b[column])
        return direction === 'asc' ? res : -res
      })
    }
  }

  searchfilter() {
    this.searchCountries = search(this.filter, this.pipe)
  }

  refreshCountries() {
    this.countries = paginateData
      .map((country, i) => ({
        ...country,
      }))
      .slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
      )
  }

  onCompleteSort({ column, direction }: CustomSortEvent) {
    for (const header of this.headers) {
      if (header.sortable !== column) {
        header.direction = ''
      }
    }

    this.tableService.sortColumn = column
    this.tableService.sortDirection = direction
  }
}
