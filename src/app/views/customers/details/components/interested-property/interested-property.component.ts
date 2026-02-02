import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { propertyData } from '@views/property/data'

@Component({
  selector: 'customer-interested-property',
  standalone: true,
  imports: [],
  templateUrl: './interested-property.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InterestedPropertyComponent {
  propertyList = propertyData.slice(0, 3)
}
