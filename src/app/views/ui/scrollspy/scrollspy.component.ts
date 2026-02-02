import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component'
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-scrollspy',
  standalone: true,
  imports: [PageTitleComponent, UIExamplesListComponent, NgbScrollSpyModule],
  templateUrl: './scrollspy.component.html',
  styles: ``,
})
export class ScrollspyComponent {}
