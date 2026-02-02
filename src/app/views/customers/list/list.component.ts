import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core'
import { CustomersService } from '@core/services/customers.service'
import { PageTitleComponent } from '@component/page-title.component'
import { TranslateService } from '@ngx-translate/core'

import {
  NgbDropdownModule,
  NgbPaginationModule,
  NgbModal,
  NgbModalModule,
} from '@ng-bootstrap/ng-bootstrap'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { CustomerType } from '../../../core/models/customer.model'
import { TranslateModule } from '@ngx-translate/core'
import { RouterModule } from '@angular/router'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    PageTitleComponent,
    NgbPaginationModule,
    NgbDropdownModule,
    NgbModalModule,
    FormsModule,
    TranslateModule,
    RouterModule,
  ],
  templateUrl: './list.component.html',
   styleUrls: ['./list.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListComponent implements OnInit {
  customerList: CustomerType[] = []
  filteredCustomers: CustomerType[] = []
  searchText: string = ''
  stateList: any[] = []
  selectedCustomer: CustomerType | null = null
  editCustomer: Partial<CustomerType> | null = null

  page: number = 1
  pageSize: number = 10
  isEditMode: boolean = false
  private searchTimeout: any

  constructor(
    private modalService: NgbModal,
    private customerService: CustomersService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadStats()
    this.loadCustomers()
  }

  loadStats() {
    this.customerService.getCustomerStats().subscribe((stats) => {
      this.stateList = [
        {
          title: 'CUSTOMERS.STATS.TOTAL',
          amount: stats.users,
          change: 5,
          variant: 'primary',
          icon: 'mdi:account-group',
        },
        {
          title: 'CUSTOMERS.STATS.PENDING',
          amount: stats.pendingUsers,
          change: -2,
          variant: 'warning',
          icon: 'mdi:account-clock',
        },
        {
          title: 'CUSTOMERS.STATS.REJECTED',
          amount: stats.rejectedUsers,
          variant: 'danger',
          icon: 'mdi:account-cancel',
        },
        {
          title: 'CUSTOMERS.STATS.INVESTORS',
          amount: stats.investors,
          variant: 'success',
          icon: 'mdi:briefcase',
        },
        {
          title: 'CUSTOMERS.STATS.BUYERS',
          amount: stats.buyers,
          variant: 'info',
          icon: 'mdi:cart',
        },
      ]
    })
  }

  loadCustomers() {
    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customerList = customers.map((c) => ({
          ...c,
          displayName:
            typeof c.name === 'object' ? c.name.en || c.name.ar || '' : c.name,
        }))
        this.filteredCustomers = [...this.customerList]
      },
      error: (err) => console.error('Error fetching customers:', err),
    })
  }

  filterCustomers() {
    clearTimeout(this.searchTimeout)
    this.searchTimeout = setTimeout(() => {
      const search = this.searchText.toLowerCase().trim()
      if (!search) {
        this.filteredCustomers = [...this.customerList]
        return
      }

      this.filteredCustomers = this.customerList.filter((c: any) => {
        const name =
          typeof c.displayName === 'string'
            ? c.displayName
            : c.displayName?.en || c.displayName?.ar || ''
        return (
          name.toLowerCase().includes(search) ||
          c.email?.toLowerCase().includes(search) ||
          c.phone?.toLowerCase().includes(search) ||
          c.country?.toLowerCase().includes(search) ||
          c.status?.toLowerCase().includes(search)
        )
      })
    }, 300)
  }

  openCustomerModal(tpl: any, customer: CustomerType) {
    this.customerService.getOneCustomer(customer.id).subscribe({
      next: (data) => {
        this.selectedCustomer = data
        this.editCustomer = { ...data }
        this.isEditMode = false
        this.modalService.open(tpl, { size: 'lg', centered: true })
      },
      error: (err) => {
        console.error('Error fetching customer:', err)
        this.selectedCustomer = customer
        this.editCustomer = { ...customer }
        this.isEditMode = false
        this.modalService.open(tpl, { size: 'lg', centered: true })
      },
    })
  }

  enterEditMode() {
    if (this.selectedCustomer) {
      this.editCustomer = { ...this.selectedCustomer }
      this.isEditMode = true
    }
  }

  cancelEdit() {
    this.isEditMode = false
    if (this.selectedCustomer) {
      this.editCustomer = { ...this.selectedCustomer }
    } else {
      this.editCustomer = null
    }
  }

  isFormValid(): boolean {
    if (!this.editCustomer) return false

    const nameValid =
      typeof this.editCustomer.name === 'string'
        ? this.editCustomer.name.trim().length >= 3
        : !!(this.editCustomer.name?.en || this.editCustomer.name?.ar)

    const emailValid =
      !!this.editCustomer.email && /\S+@\S+\.\S+/.test(this.editCustomer.email)
    const phoneValid =
      !!this.editCustomer.phone &&
      /^\+?[0-9]{8,15}$/.test(this.editCustomer.phone)
    const statusValid = !!this.editCustomer.status
    const countryValid = !!this.editCustomer.country
    const roleValid = !!this.editCustomer.role

    return (
      nameValid &&
      emailValid &&
      phoneValid &&
      statusValid &&
      countryValid &&
      roleValid
    )
  }

  saveCustomerChanges() {
    if (!this.isFormValid()) {
      Swal.fire(
        this.translate('CUSTOMERS.ALERTS.WARNING_TITLE'),
        this.translate('CUSTOMERS.ALERTS.FILL_REQUIRED_FIELDS'),
        'warning'
      )
      return
    }

    if (this.editCustomer && this.editCustomer.id) {
      this.customerService
        .updateCustomer(this.editCustomer.id, this.editCustomer)
        .subscribe({
          next: () => {
            this.loadCustomers()
            this.loadStats()
            this.modalService.dismissAll()
            this.selectedCustomer = null
            this.editCustomer = null
            this.isEditMode = false

            Swal.fire({
              title: this.translate('CUSTOMERS.ALERTS.SUCCESS_TITLE'),
              text: this.translate('CUSTOMERS.ALERTS.UPDATE_SUCCESS'),
              icon: 'success',
              confirmButtonText: this.translate('CUSTOMERS.ALERTS.OK'),
            })
          },
          error: (err) => {
            console.error('Error updating customer:', err)
            Swal.fire(
              this.translate('CUSTOMERS.ALERTS.ERROR_TITLE'),
              this.translate('CUSTOMERS.ALERTS.UPDATE_ERROR'),
              'error'
            )
          },
        })
    }
  }

  deleteCustomer(id?: string) {
    if (!id) return

    Swal.fire({
      title: this.translate('CUSTOMERS.ALERTS.CONFIRM_DELETE_TITLE'),
      text: this.translate('CUSTOMERS.ALERTS.CONFIRM_DELETE_TEXT'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate('CUSTOMERS.ALERTS.CONFIRM_YES'),
      cancelButtonText: this.translate('CUSTOMERS.ALERTS.CONFIRM_CANCEL'),
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.deleteCustomer(id).subscribe({
          next: () => {
            this.loadCustomers()
            this.loadStats()
            if (this.selectedCustomer?.id === id) {
              this.modalService.dismissAll()
              this.selectedCustomer = null
              this.editCustomer = null
              this.isEditMode = false
            }

            Swal.fire(
              this.translate('CUSTOMERS.ALERTS.DELETED_TITLE'),
              this.translate('CUSTOMERS.ALERTS.DELETED_SUCCESS'),
              'success'
            )
          },
          error: (err) => {
            console.error('Error deleting customer:', err)
            Swal.fire(
              this.translate('CUSTOMERS.ALERTS.ERROR_TITLE'),
              this.translate('CUSTOMERS.ALERTS.DELETE_ERROR'),
              'error'
            )
          },
        })
      }
    })
  }
confirmUser(id?: string) {
  if (!id) return;

  Swal.fire({
    title: this.translate('CUSTOMERS.ALERTS.CONFIRM_VERIFY_TITLE') || 'تأكيد المستخدم',
    text: this.translate('CUSTOMERS.ALERTS.CONFIRM_VERIFY_TEXT') || 'هل أنت متأكد أنك تريد تأكيد هذا المستخدم؟',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: this.translate('CUSTOMERS.ALERTS.CONFIRM_VERIFY_YES') || 'نعم، تأكيد',
    cancelButtonText: this.translate('CUSTOMERS.ALERTS.CONFIRM_CANCEL') || 'إلغاء',
  }).then((result) => {
    if (result.isConfirmed) {
      this.customerService.confirmUser(id, 'confirmed').subscribe({
        next: (res: any) => {
          this.loadCustomers();

          Swal.fire(
            this.translate('CUSTOMERS.ALERTS.VERIFIED_TITLE') || 'تم التأكيد',
            this.translate('CUSTOMERS.ALERTS.VERIFIED_SUCCESS') || 'تم تأكيد المستخدم بنجاح ✅',
            'success'
          );
        },
        error: (err) => {
          console.error('Error confirming user:', err);
          Swal.fire(
            this.translate('CUSTOMERS.ALERTS.ERROR_TITLE') || 'خطأ',
            this.translate('CUSTOMERS.ALERTS.VERIFY_ERROR') || 'حدث خطأ أثناء تأكيد المستخدم ❌',
            'error'
          );
        },
      });
    }
  });
}



  private translate(key: string): string {
    return this.translateService.instant(key)
  }
}
