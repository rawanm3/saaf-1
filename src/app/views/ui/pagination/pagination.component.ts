import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [PageTitleComponent, UIExamplesListComponent, NgbPaginationModule],
  templateUrl: './pagination.component.html',
  styles: ``,
})
export class PaginationComponent {}
