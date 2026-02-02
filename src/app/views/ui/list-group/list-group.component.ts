import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component'

@Component({
  selector: 'app-list-group',
  standalone: true,
  imports: [PageTitleComponent, UIExamplesListComponent],
  templateUrl: './list-group.component.html',
  styles: ``,
})
export class ListGroupComponent {}
