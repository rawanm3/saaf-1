import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component'
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-collapse',
  standalone: true,
  imports: [PageTitleComponent, UIExamplesListComponent, NgbCollapseModule],
  templateUrl: './collapse.component.html',
  styles: ``,
})
export class CollapseComponent {
  isCollapsed = true
  isHorizontal = true
  isFirstToggle = true
  isSecondToggle = true
}
