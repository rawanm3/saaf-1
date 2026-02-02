import { Component } from '@angular/core'
import { currentYear } from '@common/constants'
import { PageTitleComponent } from '@component/page-title.component'
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component'

@Component({
  selector: 'app-basic',
  standalone: true,
  imports: [PageTitleComponent, UIExamplesListComponent],
  templateUrl: './basic.component.html',
  styles: ``,
})
export class BasicComponent {
  currentYear = currentYear
}
