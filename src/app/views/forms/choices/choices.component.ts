import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component'
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive'

@Component({
  selector: 'app-choices',
  standalone: true,
  imports: [
    PageTitleComponent,
    SelectFormInputDirective,
    UIExamplesListComponent,
  ],
  templateUrl: './choices.component.html',
  styles: ``,
})
export class ChoicesComponent {}
