import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component'

@Component({
  selector: 'app-checkbox-radio',
  standalone: true,
  imports: [PageTitleComponent, UIExamplesListComponent],
  templateUrl: './checkbox-radio.component.html',
  styles: ``,
})
export class CheckboxRadioComponent {}
