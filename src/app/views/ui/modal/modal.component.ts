import { Component, inject, type TemplateRef } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component'
import {
  NgbModal,
  NgbModalModule,
  type NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [PageTitleComponent, UIExamplesListComponent, NgbModalModule],
  templateUrl: './modal.component.html',
  styles: ``,
})
export class ModalComponent {
  private modalService = inject(NgbModal)

  open(content: TemplateRef<any>) {
    this.modalService.open(content)
  }

  staticBackdrop(content: TemplateRef<any>) {
    this.modalService.open(content)
  }

  openModal(content: TemplateRef<HTMLElement>, options: NgbModalOptions) {
    this.modalService.open(content, options)
  }
}
