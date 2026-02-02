import { Component, inject } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component'
import { ToastsContainer } from './toasts-container.component'
import { FormsModule } from '@angular/forms'
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap'
import { ToastService } from '@core/services/toast-service'
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive'

@Component({
  selector: 'toasts',
  standalone: true,
  imports: [
    PageTitleComponent,
    UIExamplesListComponent,
    ToastsContainer,
    FormsModule,
    NgbToastModule,
    SelectFormInputDirective,
  ],
  templateUrl: './toasts.component.html',
  styles: ``,
})
export class ToastsComponent {
  liveToast = false
  show = true
  show1 = true
  show2 = true
  show3 = true
  placement = true
  translucent = true
  toastPlacement: string = ''
  toastService = inject(ToastService)

  showStandard() {
    this.toastService.show({
      content: 'See? Just like this.',
      delay: 10000,
      classname: 'standard',
    })
  }

  showStandard2() {
    this.toastService.show({
      content: 'Heads up, toasts will stack automatically',
      delay: 10000,
      classname: 'standard',
    })
  }

  close() {
    this.show = false
  }
}
