import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core'
import { SimplebarAngularModule } from 'simplebar-angular'
import { emailBodyFileData, emailBodyImageData } from '../../data'
import { NgbDropdownModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap'
import { InboxMailComponent } from '../inbox-mail/inbox-mail.component'
import { EmailMenuComponent } from '../email-menu/email-menu.component'

@Component({
  selector: 'email-view',
  standalone: true,
  imports: [SimplebarAngularModule, NgbDropdownModule],
  templateUrl: './email-view.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EmailViewComponent {
  emailBodyImageData = emailBodyImageData
  emailBodyFileData = emailBodyFileData

  offcanvasService = inject(NgbOffcanvas)

  openEmailList() {
    this.offcanvasService.open(InboxMailComponent, { position: 'end' })
  }

  opemEmailMenu() {
    this.offcanvasService.open(EmailMenuComponent, { position: 'start' })
  }
}
