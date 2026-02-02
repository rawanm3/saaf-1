import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core'
import {
  NgbActiveOffcanvas,
  NgbCollapseModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular'
import { ComposeComponent } from '../compose/compose.component'

@Component({
  selector: 'email-menu',
  standalone: true,
  imports: [SimplebarAngularModule, NgbCollapseModule],
  templateUrl: './email-menu.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class EmailMenuComponent {
  isCollapsed = false
  labelsCollapsed = false

  modalService = inject(NgbModal)
  activeOffcanvas = inject(NgbActiveOffcanvas)

  openModal() {
    this.modalService.open(ComposeComponent, { size: 'lg' })
  }
}
