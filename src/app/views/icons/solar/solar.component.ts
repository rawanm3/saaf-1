import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'

@Component({
  selector: 'app-solar',
  standalone: true,
  imports: [PageTitleComponent],
  templateUrl: './solar.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SolarComponent {}
