import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-wizard',
  standalone: true,
  imports: [PageTitleComponent, NgbNavModule],
  templateUrl: './wizard.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WizardComponent {
  active = 1
  activeId = 1
}
