import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { faqData } from './data'
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [PageTitleComponent, NgbAccordionModule],
  templateUrl: './faqs.component.html',
  styles: ``,
})
export class FaqsComponent {
  faqList = faqData
}
