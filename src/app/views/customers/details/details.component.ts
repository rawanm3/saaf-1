import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms'
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
  takeUntil,
  tap,
  catchError,
} from 'rxjs'
import { CustomerInfoComponent } from './components/customer-info/customer-info.component'
import { Customer } from '../../../core/models/customer.model'  

import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component'
import { TransactionsComponent } from './components/transactions/transactions.component'
import { TranslateModule } from '@ngx-translate/core'
import { CustomersService } from '@core/services/customers.service'
import Swal from 'sweetalert2'


@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    CustomerInfoComponent,
    TransactionHistoryComponent,
    TransactionsComponent,
    TranslateModule,
  ],
  templateUrl: './details.component.html',
  styles: ``,
})
export class DetailsComponent implements OnInit, OnDestroy {
  customer: Customer | null = null
  editMode = false
  customerForm!: FormGroup

  searchControl = new FormControl('')
  filteredCustomers: Customer[] = []
  searching = false

  loading = false
  saving = false
  error: string | null = null
  saveError: string | null = null

  roleOptions: string[] = ["user", "admin", "investor", "buyer"]
  statusOptions: string[] = ['pending', 'rejected', 'confirmed']

  private destroy$ = new Subject<void>()

  currentLang: 'en' | 'ar' = 'en'

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomersService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get('id')
      if (id) this.fetchById(id)
    })

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => (this.searching = true)),
        switchMap((q) => {
          const query = (q || '').toString().trim()
          if (!query) {
            this.searching = false
            return of([])
          }
          return this.customerService.searchUsers(query).pipe(
            catchError(() => of([])),
            tap(() => (this.searching = false))
          )
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((users) => (this.filteredCustomers = users || []))
  }

  fetchById(id: string) {
    this.loading = true
    this.error = null
    this.customerService.getCustomerById(id).subscribe({
      next: (u) => {
        this.customer = u
        this.initForm()
        this.loading = false
      },
      error: () => {
        this.error = 'Failed to load customer.'
        this.loading = false
      },
    })
  }

 initForm() {
  this.customerForm = this.fb.group({
    name: [
      this.customer?.name || '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z\u0600-\u06FF\s]+$/), 
      ],
    ],
    email: [
      this.customer?.email || '',
      [
        Validators.required,
        Validators.email,
        Validators.maxLength(100),
      ],
    ],
    phone: [
      this.customer?.phone || this.customer?.mobile || '',
      [
        Validators.required,
        Validators.pattern(/^(\+?\d{10,15})$/),
      ],
    ],
    country: [
      this.customer?.country || '',
      [
        Validators.required,
        Validators.minLength(2),
      ],
    ],
    status: [
      this.customer?.status || '',
      [Validators.required],
    ],
    role: [
      this.customer?.customerType || '',
      [Validators.required],
    ],
  })
}


  enableEdit() {
    this.editMode = true
  }

saveChanges() {
  const id = this.customer?._id || this.customer?.id
  if (!id || !this.customerForm.valid) return

  this.saving = true
  this.saveError = null

  const payload: Partial<Customer> = {
    ...this.customerForm.value,
    name: this.customerForm.value.name?.toString() || '',
  }

  this.customerService.updateOneCustomer(id, payload).subscribe({
    next: (res) => {
      this.saving = false
      this.editMode = false

      Swal.fire({
        icon: 'success',
        title: 'تم الحفظ بنجاح ',
        text: 'تم تحديث بيانات العميل بنجاح!',
        confirmButtonText: 'حسناً',
      }).then(() => {
        this.fetchById(id)
      })
    },
    error: (err) => {
      console.error(' Error updating customer:', err)
      this.saving = false
      this.saveError = 'حدث خطأ أثناء حفظ التعديلات.'

      Swal.fire({
        icon: 'error',
        title: 'فشل الحفظ ',
        text: 'حدث خطأ أثناء حفظ التعديلات، حاول مرة أخرى.',
        confirmButtonText: 'موافق',
      })
    },
  })
}

  selectSuggestion(u: Customer) {
    const id = u?._id || u?.id
    if (!id) return
    this.router.navigate(['/customers/details', id])
  }

  switchLang(lang: 'en' | 'ar') {
    this.currentLang = lang
    this.initForm()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
