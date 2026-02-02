import { Component } from '@angular/core'
import { CommonModule, CurrencyPipe } from '@angular/common'
import { PageTitleComponent } from '@component/page-title.component'
import { AddInformationComponent } from './add-information/add-information.component'
import { PropertyService } from '@core/services/property.service'
import { Property } from '@core/models/property.model'
import { TranslateModule } from '@ngx-translate/core'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    PageTitleComponent,
    AddInformationComponent,
    TranslateModule,
  ],
  templateUrl: './add.component.html',
  styles: ``,
})
export class AddComponent {
  createdProperty: Property | null = null
  propertyData: Partial<Property> = {}

  constructor(private propertyService: PropertyService) {}

  onInfoChange(updatedData: Partial<Property>) {
    this.propertyData = { ...this.propertyData, ...updatedData }
  }

  createProperty() {
    console.log('propertyData:', this.propertyData)
    const formData = new FormData()

    ;(Object.keys(this.propertyData) as (keyof Property)[]).forEach((key) => {
      const value = this.propertyData[key]
      if (value !== undefined && value !== null) {
        formData.append(
          key,
          typeof value === 'object' ? JSON.stringify(value) : String(value)
        )
      }
    })

    this.propertyService.addProperty(formData).subscribe({
      next: (res: Property) => {
        this.createdProperty = res

        Swal.fire({
          title: 'Added Successfully',
          text: 'The property has been successfully added to the system.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
          customClass: {
            popup: 'swal-ltr',
          },
        })

        this.propertyData = {}
      },
      error: (err: { error?: { message?: string } }) => {
        console.error(err)

        Swal.fire({
          title: 'Error Occurred!',
          text:
            err.error?.message ||
            'An error occurred while adding the property. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#d33',
          customClass: {
            popup: 'swal-ltr',
          },
        })
      },
    })
  }
}
