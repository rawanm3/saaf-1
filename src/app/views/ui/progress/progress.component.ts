import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component'
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [PageTitleComponent, UIExamplesListComponent, NgbProgressbarModule],
  templateUrl: './progress.component.html',
  styles: ``,
})
export class ProgressComponent {}
