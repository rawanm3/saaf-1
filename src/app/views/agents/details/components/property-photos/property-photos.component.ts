import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'agent-property-photos',
  standalone: true,
  imports: [NgbCarouselModule],
  templateUrl: './property-photos.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PropertyPhotosComponent {}
