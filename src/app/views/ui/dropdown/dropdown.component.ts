import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [PageTitleComponent, UIExamplesListComponent, NgbDropdownModule],
  templateUrl: './dropdown.component.html',
  styles: ``,
})
export class DropdownComponent {}
