import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component'
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-tooltips',
  standalone: true,
  imports: [PageTitleComponent, NgbTooltipModule, UIExamplesListComponent],
  templateUrl: './tooltips.component.html',
  styles: ``,
})
export class TooltipsComponent {}
