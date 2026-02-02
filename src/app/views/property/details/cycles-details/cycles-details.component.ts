import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms'
import { PropertyService } from '@core/services/property.service'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { CommonModule, DatePipe } from '@angular/common'
import { ActivatedRoute } from '@angular/router'
import Swal from 'sweetalert2'
import { PropertyCycle, CycleStats } from '@core/models/property.model'
import { AuthenticationService } from '@core/services/auth.service'

@Component({
  selector: 'app-cycles-details',
  templateUrl: './cycles-details.component.html',
  standalone: true,
  imports: [TranslateModule, CommonModule, ReactiveFormsModule],
  providers: [DatePipe],
})
export class CyclesDetailsComponent implements OnInit {
  @Input() propertyId!: string

  currency: string = 'SAR'
  cycles: PropertyCycle[] = []
  isAdmin: boolean = false
  selectedCycle?: PropertyCycle
  cyclesStats?: CycleStats
  loading = false
  showCreateCycleForm = false
  errorMessage = ''
  editMode = false
  cycleForm!: FormGroup

  expenseFields = [
    { label: 'PROPERTY.DEPOSIT_AMOUNT', control: 'depositAmount' },
    { label: 'PROPERTY.VALUE_ADDED_TAX', control: 'valueAddedTax' },
    { label: 'PROPERTY.ADMINISTRATIVE_FEES', control: 'administrativeFees' },
    { label: 'PROPERTY.BROKERAGE_FEES', control: 'brokerageFees' },
    { label: 'PROPERTY.MAINTENANCE_FEES', control: 'maintenanceFees' },
    { label: 'PROPERTY.MANAGEMENT_FEES', control: 'managementFees' },
    { label: 'PROPERTY.TRANSFER_FEES', control: 'transferFees' },
    { label: 'PROPERTY.TAX_FEES', control: 'taxFees' },
    {
      label: 'PROPERTY.REAL_ESTATE_TRANSACTION_TAX',
      control: 'realEstateTransactionTax',
    },
    { label: 'PROPERTY.RESERVE_FOR_CAPEX', control: 'reserveForCapEx' },
    { label: 'PROPERTY.OTHER_EXPENSES', control: 'otherExpenses' },
  ]

  constructor(
    private propertyService: PropertyService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('propertyId')
      if (!id) {
        console.error('Property ID is missing')
      } else {
        this.propertyId = id
        this.initCycleForm()
        this.setupFormCalculations()
        this.loadCycles()
      }
    })
  }

  trackByCycleId(index: number, cycle: PropertyCycle): string {
    return cycle._id
  }

  private periodValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const start = group.get('periodStart')?.value
      const end = group.get('periodEnd')?.value
      if (start && end && new Date(end) <= new Date(start)) {
        return { invalidPeriod: true }
      }
      return null
    }
  }

  private netRevenueValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const grossCollected = Number(group.get('grossCollected')?.value || 0)
      const totalExpenses = Number(group.get('totalExpenses')?.value || 0)
      const netRevenue = grossCollected - totalExpenses
      if (netRevenue <= 0) {
        return { netRevenueInvalid: true }
      }
      return null
    }
  }

  private expensesVsGrossValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const grossCollected = Number(group.get('grossCollected')?.value || 0)
      const totalExpenses = Number(group.get('totalExpenses')?.value || 0)
      if (totalExpenses > grossCollected) {
        return { expensesExceedIncome: true }
      }
      return null
    }
  }

  private initCycleForm(): void {
    this.cycleForm = this.fb.group(
      {
        periodStart: ['', Validators.required],
        periodEnd: ['', Validators.required],
        grossCollected: [null, [Validators.required, Validators.min(1)]],
        propertyValue: [null, [Validators.required, Validators.min(1000)]],
        depositAmount: [0, [Validators.min(0)]],
        valueAddedTax: [0, [Validators.min(0)]],
        administrativeFees: [0, [Validators.min(0)]],
        brokerageFees: [0, [Validators.min(0)]],
        maintenanceFees: [0, [Validators.min(0)]],
        managementFees: [0, [Validators.min(0)]],
        transferFees: [0, [Validators.min(0)]],
        taxFees: [0, [Validators.min(0)]],
        realEstateTransactionTax: [0, [Validators.min(0)]],
        reserveForCapEx: [0, [Validators.min(0)]],
        otherExpenses: [0, [Validators.min(0)]],
        totalExpenses: [{ value: 0, disabled: true }],
        netRevenue: [{ value: 0, disabled: true }],
        monthlyReturn: [{ value: 0, disabled: true }],
        annualReturn: [{ value: 0, disabled: true }],
      },
      {
        validators: [
          this.periodValidator(),
          this.netRevenueValidator(),
          this.expensesVsGrossValidator(),
        ],
      }
    )
  }

  private setupFormCalculations(): void {
    this.cycleForm.valueChanges.subscribe((values) => {
      const totalExpenses = this.expenseFields.reduce(
        (sum, field) => sum + (Number(values[field.control]) || 0),
        0
      )
      const grossCollected = Number(values.grossCollected) || 0
      const netRevenue = grossCollected - totalExpenses
      const monthlyReturn = netRevenue / 12
      const annualReturn = netRevenue

      this.cycleForm.patchValue(
        {
          totalExpenses,
          netRevenue,
          monthlyReturn,
          annualReturn,
        },
        { emitEvent: false }
      )
    })
  }

  onCreateNew(): void {
    this.showCreateCycleForm = true
    this.editMode = false
    this.selectedCycle = undefined
    this.cycleForm.reset({
      periodStart: '',
      periodEnd: '',
      grossCollected: null,
      propertyValue: null,
    })
  }

  onEdit(cycle: PropertyCycle): void {
    if (!this.cycleForm) this.initCycleForm()
    this.showCreateCycleForm = true
    this.editMode = true
    this.selectedCycle = cycle

    const formatDate = (date: string | undefined) =>
      date ? date.split('T')[0] : ''

    this.cycleForm.patchValue({
      periodStart: formatDate(cycle.periodStart),
      periodEnd: formatDate(cycle.periodEnd),
      grossCollected: cycle.grossCollected ?? null,
      propertyValue: cycle.propertyValue ?? null,
      depositAmount: cycle.depositAmount ?? 0,
      valueAddedTax: cycle.valueAddedTax ?? 0,
      administrativeFees: cycle.administrativeFees ?? 0,
      brokerageFees: cycle.brokerageFees ?? 0,
      maintenanceFees: cycle.maintenanceFees ?? 0,
      managementFees: cycle.managementFees ?? 0,
      transferFees: cycle.transferFees ?? 0,
      taxFees: cycle.taxFees ?? 0,
      realEstateTransactionTax: cycle.realEstateTransactionTax ?? 0,
      reserveForCapEx: cycle.reserveForCapEx ?? 0,
      otherExpenses: cycle.otherExpenses ?? 0,
    })
  }

  cancelEdit(): void {
    this.showCreateCycleForm = false
    this.editMode = false
    this.selectedCycle = undefined
  }

  private showValidationErrors(): void {
    Object.keys(this.cycleForm.controls).forEach((key) => {
      const control = this.cycleForm.get(key)
      control?.markAsTouched()
      control?.updateValueAndValidity()
    })

    if (this.cycleForm.errors?.['invalidPeriod']) {
      Swal.fire({
        icon: 'warning',
        title: this.translate.instant('PROPERTY.ERROR_INVALID_PERIOD'),
      })
    } else if (this.cycleForm.errors?.['expensesExceedIncome']) {
      Swal.fire({
        icon: 'warning',
        title: this.translate.instant('PROPERTY.ERROR_EXPENSES_EXCEED'),
      })
    } else if (this.cycleForm.errors?.['netRevenueInvalid']) {
      Swal.fire({
        icon: 'warning',
        title: this.translate.instant('PROPERTY.ERROR_NET_REVENUE'),
      })
    }
  }

  createOrUpdateCycle(): void {
    if (this.cycleForm.invalid) {
      this.showValidationErrors()
      return
    }

    const data = {
      ...this.cycleForm.getRawValue(),
      propertyId: this.propertyId,
    }

    if (this.editMode && this.selectedCycle) {
      this.updateCycle(this.selectedCycle._id, data)
    } else {
      this.createCycle(data)
    }
  }

  private createCycle(data: any): void {
    this.propertyService.createPropertyCycle(data).subscribe({
      next: () => {
        this.loadCycles()
        this.showCreateCycleForm = false
        Swal.fire({
          icon: 'success',
          title: this.translate.instant('PROPERTY.CYCLE_CREATED'),
        })
      },
      error: (err) =>
        Swal.fire({
          icon: 'error',
          title: this.translate.instant('PROPERTY.ERROR_CREATING_CYCLE'),
          text: err.message,
        }),
    })
  }

  private updateCycle(cycleId: string, data: any): void {
    this.propertyService.updatePropertyCycle(cycleId, data).subscribe({
      next: () => {
        this.loadCycles()
        Swal.fire({
          icon: 'success',
          title: this.translate.instant('PROPERTY.CYCLE_UPDATED'),
        })
      },
      error: (err) =>
        Swal.fire({
          icon: 'error',
          title: this.translate.instant('PROPERTY.ERROR_UPDATING_CYCLE'),
          text: err.message,
        }),
    })
  }

  approveCycle(cycleId: string): void {
    Swal.fire({
      title: this.translate.instant('PROPERTY.CONFIRM_APPROVE'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('COMMON.YES'),
      cancelButtonText: this.translate.instant('COMMON.NO'),
    }).then((result) => {
      if (result.isConfirmed) {
        this.propertyService.approvePropertyCycle(cycleId).subscribe({
          next: () => {
            this.cycles = this.cycles.filter((c) => c._id !== cycleId)
            this.cdr.detectChanges()
            Swal.fire({
              icon: 'success',
              title: this.translate.instant('PROPERTY.CYCLE_APPROVED'),
            })
          },
          error: (err) =>
            Swal.fire({
              icon: 'error',
              title: this.translate.instant('PROPERTY.ERROR_APPROVING_CYCLE'),
              text: err.message,
            }),
        })
      }
    })
  }

  rejectCycle(cycleId: string): void {
    Swal.fire({
      title: this.translate.instant('PROPERTY.CONFIRM_REJECT'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('COMMON.YES'),
      cancelButtonText: this.translate.instant('COMMON.NO'),
    }).then((result) => {
      if (result.isConfirmed) {
        this.propertyService.rejectPropertyCycle(cycleId).subscribe({
          next: () => {
            this.cycles = this.cycles.filter((c) => c._id !== cycleId)
            this.cdr.detectChanges()
            Swal.fire({
              icon: 'success',
              title: this.translate.instant('PROPERTY.CYCLE_REJECTED'),
            })
          },
          error: (err) =>
            Swal.fire({
              icon: 'error',
              title: this.translate.instant('PROPERTY.ERROR_REJECTING_CYCLE'),
              text: err.message,
            }),
        })
      }
    })
  }

  loadCycles(): void {
    this.loading = true
    this.propertyService.getPropertyCycles(this.propertyId).subscribe({
      next: (cycles) => {
        this.cycles = cycles
        this.loading = false
        this.cdr.detectChanges()
      },
      error: (err) => {
        this.errorMessage = this.translate.instant(
          'PROPERTY.ERROR_LOADING_CYCLES'
        )
        Swal.fire({
          icon: 'error',
          title: this.errorMessage,
          text: err.message,
        })
        this.loading = false
      },
    })
  }

  loadCycleDetails(cycleId: string): void {
    this.propertyService.getPropertyCycleById(cycleId).subscribe({
      next: (cycle) => (this.selectedCycle = cycle),
      error: (err) =>
        Swal.fire({
          icon: 'error',
          title: this.translate.instant('PROPERTY.ERROR_LOADING_CYCLE'),
          text: err.message,
        }),
    })
  }

  loadCyclesStats(): void {
    this.propertyService.getCyclesStats().subscribe({
      next: (stats) => (this.cyclesStats = stats),
      error: (err) =>
        Swal.fire({
          icon: 'error',
          title: this.translate.instant('PROPERTY.ERROR_LOADING_STATS'),
          text: err.message,
        }),
    })
  }

  toggleDetails(cycle: any): void {
    cycle.showDetails = !cycle.showDetails
  }

  isEmployee(): boolean {
    return this.authService.userRole === 'employee'
  }
}
