import { CommonModule, DecimalPipe } from '@angular/common'
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { FormsModule } from '@angular/forms'
import { currency } from '@common/constants'
import { RouterModule } from '@angular/router'
import { TemplateRef, ViewChild } from '@angular/core'
import { Output, EventEmitter } from '@angular/core'
import Swal from 'sweetalert2'
import { TranslateService } from '@ngx-translate/core'
import {
  NgbDropdownModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap'
import { PropertyService } from '@core/services/property.service'
import { Property } from '@core/models/property.model'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { Subject, debounceTime } from 'rxjs'
import { AuthenticationService } from '@core/services/auth.service'

@Component({
  selector: 'property-data',
  standalone: true,
  imports: [
    DecimalPipe,
    CommonModule,
    FormsModule,
    RouterModule,
    NgbPaginationModule,
    NgbDropdownModule,
    TranslateModule,
  ],
  templateUrl: './property-data.component.html',
  styleUrls: ['./property-data.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PropertyDataComponent implements OnInit {
  propertyList: Property[] = []
  filteredProperties: Property[] = []
  paginatedProperties: Property[] = []
  properties: Property[] = []

  currency = currency

  selectedProperty: Property | null = null
  isEditMode: boolean = false
  editPropertyData: Partial<Property> = {}
  page = 1
  pageSize = 10
  collectionSize = 0
  isSearching = false
  currentRole: string = 'employee'
  isUserAccountant: boolean = false

  searchText: string = ''
  private searchSubject = new Subject<string>()

  constructor(
    private modalService: NgbModal,
    private propertyService: PropertyService,
    private translate: TranslateService,
    private authService: AuthenticationService
  ) {}
  @ViewChild('confirmDeleteModal') confirmDeleteModal!: TemplateRef<any>
  @Output() propertyChanged = new EventEmitter<void>()
  ngOnInit(): void {
    this.currentRole = this.authService.userRole
    this.isUserAccountant = this.currentRole === 'accountant'
    
    this.loadAllProperties()
    this.searchSubject.pipe(debounceTime(400)).subscribe((search) => {
      this.filterLocal(search)
    })
  }

  loadAllProperties(): void {
    this.propertyService.getAllRealEstates().subscribe({
      next: (properties: Property[]) => {
        this.propertyList = properties || []
        this.filteredProperties = [...this.propertyList]
        this.collectionSize = this.filteredProperties.length
        this.refreshProperties()
      },
      error: (err) => {
        console.error('Error fetching properties', err)
      },
    })
  }

  refreshProperties(): void {
    const start = (this.page - 1) * this.pageSize
    const end = start + this.pageSize
    this.paginatedProperties = this.filteredProperties.slice(start, end)
  }

  onSearchChange(search: string): void {
    this.searchSubject.next(search)
  }

  private filterLocal(search: string): void {
    const query = search.trim().toLowerCase()

    if (!query) {
      this.filteredProperties = [...this.propertyList]
      this.collectionSize = this.filteredProperties.length
      this.refreshProperties()
      return
    }

    this.isSearching = true

    this.filteredProperties = this.propertyList.filter((p) =>
      [p?.name, p?.country, p?.location, p?.propertyType, p?.type]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(query))
    )

    this.collectionSize = this.filteredProperties.length
    this.refreshProperties()
    this.isSearching = false
  }

  openPropertyModal(content: unknown, property: Property): void {
    this.selectedProperty = property
    this.isEditMode = false
    this.editPropertyData = {}
    this.modalService.open(content, { size: 'lg' })
  }

  enterEditMode(): void {
    if (!this.selectedProperty) return

    this.isEditMode = true
    this.editPropertyData = {
      name: this.selectedProperty.name,
      type: this.selectedProperty.type,
      location: this.selectedProperty.location,
      status: this.selectedProperty.status,
      totalValue: this.selectedProperty.totalValue,
      numberOfRooms: this.selectedProperty.numberOfRooms,
      numberOfBathrooms: this.selectedProperty.numberOfBathrooms,
      square: this.selectedProperty.square,
      description: this.selectedProperty.description,
    }
  }

  cancelEdit(): void {
    this.isEditMode = false
    this.editPropertyData = {}
  }

  isFormValid(): boolean {
    return !!(
      this.editPropertyData.type &&
      this.editPropertyData.status &&
      this.editPropertyData.totalValue! > 0 &&
      this.editPropertyData.square! >= 0 &&
      this.editPropertyData.numberOfRooms! >= 0 &&
      this.editPropertyData.numberOfBathrooms! >= 0
    )
  }

  saveProperty(modal: { dismiss: () => void }): void {
    if (!this.selectedProperty?._id) {
      console.error('No property selected for editing')
      return
    }

    this.propertyService
      .updateRealEstate(this.selectedProperty._id, this.editPropertyData)
      .subscribe({
        next: (response) => {
          console.log('Property updated successfully', response)
          this.isEditMode = false
          this.editPropertyData = {}
          modal.dismiss()
          this.loadAllProperties()
          this.propertyChanged.emit()

          Swal.fire({
            icon: 'success',
            title: this.translate.instant('PROPERTY.ACTIONS.UPDATE_SUCCESS'),
            showConfirmButton: false,
            timer: 1800,
          })
        },
        error: (error) => {
          console.error('Error updating property', error)
          Swal.fire({
            icon: 'error',
            title: this.translate.instant('PROPERTY.ACTIONS.UPDATE_FAILED'),
            text: this.translate.instant('PROPERTY.ACTIONS.UPDATE_ERROR_MSG'),
            confirmButtonText: this.translate.instant('COMMON.OK'),
          })
        },
      })
  }

  deleteProperty(modal: { dismiss: () => void }): void {
    if (!this.selectedProperty?._id) {
      console.error('No property selected for deletion')
      return
    }

    Swal.fire({
      title: this.translate.instant('PROPERTY.ACTIONS.DELETE_CONFIRM_TITLE', {
        name: this.selectedProperty.name,
      }),
      text: this.translate.instant('PROPERTY.ACTIONS.DELETE_CONFIRM_TEXT'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant(
        'PROPERTY.ACTIONS.DELETE_CONFIRM_BTN'
      ),
      cancelButtonText: this.translate.instant('COMMON.CANCEL'),
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
    }).then((result) => {
      if (result.isConfirmed) {
        this.propertyService
          .deleteRealEstate(this.selectedProperty!._id)
          .subscribe({
            next: (response) => {
              console.log('Property deleted successfully', response)
              modal.dismiss()
              this.loadAllProperties()
              this.propertyChanged.emit()

              Swal.fire({
                icon: 'success',
                title: this.translate.instant(
                  'PROPERTY.ACTIONS.DELETE_SUCCESS'
                ),
                showConfirmButton: false,
                timer: 1800,
              })
            },
            error: (error) => {
              console.error('Error deleting property', error)
              Swal.fire({
                icon: 'error',
                title: this.translate.instant('PROPERTY.ACTIONS.DELETE_FAILED'),
                text: this.translate.instant(
                  'PROPERTY.ACTIONS.DELETE_ERROR_MSG'
                ),
                confirmButtonText: this.translate.instant('COMMON.OK'),
              })
            },
          })
      }
    })
  }

  openConfirmDeleteModal(template: TemplateRef<any>): void {
    this.modalService.open(template, { size: 'md' })
  }

  confirmDelete(modal: NgbModalRef): void {
    if (!this.selectedProperty?._id) return

    this.propertyService.deleteRealEstate(this.selectedProperty._id).subscribe({
      next: (response) => {
        console.log('Property deleted successfully', response)
        modal.dismiss()
        this.loadAllProperties()
        this.propertyChanged.emit()

        Swal.fire({
          icon: 'success',
          title: this.translate.instant('PROPERTY.ACTIONS.DELETE_SUCCESS'),
          showConfirmButton: false,
          timer: 1800,
        })
      },
      error: (err) => {
        console.error('Error deleting property', err)
        Swal.fire({
          icon: 'error',
          title: this.translate.instant('PROPERTY.ACTIONS.DELETE_FAILED'),
          text: this.translate.instant('PROPERTY.ACTIONS.DELETE_ERROR_MSG'),
          confirmButtonText: this.translate.instant('COMMON.OK'),
        })
      },
    })
  }

  getTranslatedStatus(property: any): string {
    if (!property || !property.status) {
      return 'PROPERTYDETAILS.NOT_AVAILABLE'
    }
    return 'PROPERTY.STATUS.' + property.status.toUpperCase()
  }

  getStatusStyle(status?: string): Record<string, string> {
    switch (status) {
      case 'available':
        return {
          backgroundColor: '#d1e7dd',
          color: '#0f5132',
          fontWeight: '600',
        }
      case 'funded':
        return {
          backgroundColor: '#cff4fc',
          color: '#055160',
          fontWeight: '600',
        }
      case 'matured':
        return {
          backgroundColor: '#e2e3e5',
          color: '#41464b',
          fontWeight: '600',
        }
      case 'sold':
        return {
          backgroundColor: '#f8d7da',
          color: '#842029',
          fontWeight: '600',
        }
      case 'pending':
        return {
          backgroundColor: '#fff3cd',
          color: '#664d03',
          fontWeight: '600',
        }
      default:
        return {
          backgroundColor: '#e9ecef',
          color: '#212529',
        }
    }
  }

  getTranslatedType(type: string): string {
    if (!type) return 'PROPERTYDETAILS.NOT_AVAILABLE'
    const map: Record<string, string> = {
      'Residential/Commercial Property':
        'PROPERTYADD.TYPE_RESIDENTIAL_COMMERCIAL_PROPERTY',
      'Administrative Property (Offices)':
        'PROPERTYADD.TYPE_ADMINISTRATIVE_PROPERTY',
      'Residential Complex': 'PROPERTYADD.TYPE_RESIDENTIAL_COMPLEX',
      'Residential/Commercial Complex':
        'PROPERTYADD.TYPE_RESIDENTIAL_COMMERCIAL_COMPLEX',
      'Commercial/Administrative Complex':
        'PROPERTYADD.TYPE_COMMERCIAL_ADMINISTRATIVE_COMPLEX',
    }
    return map[type] || 'PROPERTYDETAILS.NOT_AVAILABLE'
  }

  getStatusBadgeStyle(status?: string): Record<string, string> {
    switch (status) {
      case 'available':
        return {
          backgroundColor: '#d1e7dd',
          color: '#0f5132',
          fontWeight: '600',
        }
      case 'funded':
        return {
          backgroundColor: '#cff4fc',
          color: '#055160',
          fontWeight: '600',
        }
      case 'matured':
        return {
          backgroundColor: '#e2e3e5',
          color: '#41464b',
          fontWeight: '600',
        }
      case 'sold':
        return {
          backgroundColor: '#f8d7da',
          color: '#842029',
          fontWeight: '600',
        }
      case 'pending':
        return {
          backgroundColor: '#fff3cd',
          color: '#664d03',
          fontWeight: '600',
        }
      default:
        return {
          backgroundColor: '#e9ecef',
          color: '#212529',
        }
    }
  }

  isAccountant(): boolean {
    const role = this.authService.userRole
    console.log('🔍 isAccountant() called - Current role:', role, 'Is accountant?', role === 'accountant')
    return role === 'accountant'
  }

  get currentUserRole(): string {
    return this.authService.userRole
  }
}