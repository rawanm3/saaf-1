import { Component } from '@angular/core'
import { currentYear } from '@common/constants'
import { PageTitleComponent } from '@component/page-title.component'
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component'
import { FlatpickrDirective } from '@core/directive/flatpickr.directive'

@Component({
  selector: 'app-flatepicker',
  standalone: true,
  imports: [PageTitleComponent, UIExamplesListComponent, FlatpickrDirective],
  templateUrl: './flatepicker.component.html',
  styles: ``,
})
export class FlatepickerComponent {
  currentYear = currentYear
  currentDate = new Date(2025, 4, 9)
}
