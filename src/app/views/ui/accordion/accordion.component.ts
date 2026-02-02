import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component'
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap'
import { accordionItem } from './data'

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [PageTitleComponent, UIExamplesListComponent, NgbAccordionModule],
  templateUrl: './accordion.component.html',
  styles: ``,
})
export class AccordionComponent {
  accordionData = accordionItem
}
