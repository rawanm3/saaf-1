import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component'
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-popovers',
  standalone: true,
  imports: [PageTitleComponent, UIExamplesListComponent, NgbPopoverModule],
  templateUrl: './popovers.component.html',
  styles: ``,
})
export class PopoversComponent {}
