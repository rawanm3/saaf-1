import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { PropertyInfoComponent } from './property-info/property-info.component'
import { PropertyService } from '@core/services/property.service'
import { CommonModule } from '@angular/common'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { ChangeDetectorRef } from '@angular/core'
import Swal from 'sweetalert2'
import {
  FormBuilder,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms'

import {
  Property,
  PropertyCycle,
  PropertyResponse,
  UpdateDistributionDto,
} from '@core/models/property.model'

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    PropertyInfoComponent,
    TranslateModule,
  ],
  templateUrl: './details.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DetailsComponent implements OnInit {
  property!: Property
  isAdmin: boolean = true
  editMode = false
  propertyForm!: FormGroup
  currency: string = 'SAR'

  editFields = [
    { key: 'name', label: 'Property Name', type: 'text' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'type', label: 'Property Type', type: 'text' },
    { key: 'totalValue', label: 'Price', type: 'number' },
    { key: 'minInvestment', label: 'Min Investment', type: 'number' },
    {
      key: 'expectedNetYield',
      label: 'Expected Net Yield (%)',
      type: 'number',
    },
    {
      key: 'expectedAnnualReturn',
      label: 'Expected Annual Return (%)',
      type: 'number',
    },
    {
      key: 'holdingPeriodMonths',
      label: 'Holding Period (months)',
      type: 'number',
    },
    { key: 'description', label: 'Description', type: 'textarea' },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'available', label: 'Available' },
        { value: 'pending', label: 'Pending' },
        { value: 'sold', label: 'Sold' },
      ],
    },
    {
      key: 'isRented',
      label: 'Rented',
      type: 'select',
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
      ],
    },
    { key: 'currentRent', label: 'Current Rent', type: 'number' },
  ]

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id')
      if (id) {
        this.loadProperty(id)
        this.editMode = false 
      }
    })
  }

  private getPropertyId(): string {
    if (!this.property || !this.property._id) {
      console.error('Property ID is missing!')
      return ''
    }
    return this.property._id
  }

  loadProperty(id: string): void {
    this.propertyService.getOneRealEstate(id).subscribe({
      next: (res: PropertyResponse) => {
        this.property = (res as any).property || (res as any).data || res
        this.initForm()
      },
      error: (err: unknown) =>
        console.error('Error loading property:', JSON.stringify(err)),
    })
  }

  initForm() {
    this.propertyForm = this.fb.group({
      name: [this.property?.name || '', Validators.required],
      location: [this.property?.location || '', Validators.required],
      type: [this.property?.type || '', Validators.required],
      totalValue: [
        this.property?.totalValue || 0,
        [Validators.required, Validators.min(0)],
      ],
      minInvestment: [
        this.property?.minInvestment || 0,
        [Validators.required, Validators.min(0)],
      ],
      expectedNetYield: [
        this.property?.expectedNetYield || 0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      expectedAnnualReturn: [
        this.property?.expectedAnnualReturn || 0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      holdingPeriodMonths: [
        this.property?.holdingPeriodMonths || 0,
        [Validators.required, Validators.min(1)],
      ],
      description: [this.property?.description || '', Validators.required],
      totalShares: [
        this.property?.totalShares || 0,
        [Validators.required, Validators.min(1)],
      ],
      isRented: [this.property?.isRented || false, Validators.required],
      currentRent: [this.property?.currentRent || 0, [Validators.min(0)]],
      status: [this.property?.status || 'available', Validators.required],
      square: [this.property?.square || 0, [Validators.min(0)]],
      numberOfRooms: [this.property?.numberOfRooms || 0, [Validators.min(0)]],
      numberOfBathrooms: [
        this.property?.numberOfBathrooms || 0,
        [Validators.min(0)],
      ],
    })
  }

  enableEdit() {
    this.editMode = true
    this.initForm()
  }

  saveChanges() {
    if (!this.propertyForm.valid) {
      this.propertyForm.markAllAsTouched()
      return
    }

    this.propertyService
      .updateRealEstate(this.getPropertyId(), this.propertyForm.value)
      .subscribe({
        next: () => {
          this.loadProperty(this.getPropertyId())
          this.editMode = false
          Swal.fire({
            icon: 'success',
            title:
              this.translate.instant('PROPERTY.ALERTS.UPDATE_SUCCESS_TITLE') ||
              'Updated Successfully',
            text:
              this.translate.instant('PROPERTY.ALERTS.UPDATE_SUCCESS_TEXT') ||
              'The property changes have been saved successfully.',
            confirmButtonText:
              this.translate.instant('PROPERTY.ALERTS.OK') || 'OK',
          })
        },
        error: (err) => {
          console.error('Error saving changes:', err)
          Swal.fire({
            icon: 'error',
            title:
              this.translate.instant('PROPERTY.ALERTS.UPDATE_FAILED_TITLE') ||
              'Update Failed',
            text:
              this.translate.instant('PROPERTY.ALERTS.UPDATE_FAILED_TEXT') ||
              'An error occurred while saving the changes. Please try again.',
            confirmButtonText:
              this.translate.instant('PROPERTY.ALERTS.OK') || 'OK',
          })
        },
      })
  }

  deleteProperty() {
    Swal.fire({
      title: this.translate.instant('PROPERTY.ALERTS.CONFIRM_DELETE_TITLE'),
      text: this.translate.instant('PROPERTY.ALERTS.CONFIRM_DELETE_TEXT'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: this.translate.instant(
        'PROPERTY.ALERTS.CONFIRM_DELETE_YES'
      ),
      cancelButtonText: this.translate.instant(
        'PROPERTY.ALERTS.CONFIRM_DELETE_CANCEL'
      ),
    }).then((result) => {
      if (result.isConfirmed) {
        this.propertyService.deleteRealEstate(this.getPropertyId()).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: this.translate.instant(
                'PROPERTY.ALERTS.DELETE_SUCCESS_TITLE'
              ),
              text: this.translate.instant(
                'PROPERTY.ALERTS.DELETE_SUCCESS_TEXT'
              ),
              confirmButtonText: this.translate.instant('PROPERTY.ALERTS.OK'),
            }).then(() => {
              this.router.navigate(['/property/list'])
            })
          },
          error: (err: unknown) => {
            console.error('Error deleting property:', err)
            Swal.fire({
              icon: 'error',
              title: this.translate.instant(
                'PROPERTY.ALERTS.DELETE_ERROR_TITLE'
              ),
              text: this.translate.instant('PROPERTY.ALERTS.DELETE_ERROR_TEXT'),
              confirmButtonText: this.translate.instant('PROPERTY.ALERTS.OK'),
            })
          },
        })
      }
    })
  }

  confirmDelete() {
    this.deleteProperty()
  }

  changeStatus(event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value

    if (
      newStatus === 'available' ||
      newStatus === 'pending' ||
      newStatus === 'sold'
    ) {
      this.propertyService
        .updateStatus(this.getPropertyId(), newStatus)
        .subscribe({
          next: (res) => (this.property = res),
          error: (err) => console.error('Error updating status:', err),
        })
    } else {
      console.error('Invalid status value:', newStatus)
    }
  }
}
