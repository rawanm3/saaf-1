import { CommonModule, DatePipe } from '@angular/common'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { userData } from '@views/apps/messages/data'
import { SimplebarAngularModule } from 'simplebar-angular'

@Component({
  selector: 'inbox-mail',
  standalone: true,
  imports: [DatePipe, SimplebarAngularModule, NgbDropdownModule, CommonModule],
  templateUrl: './inbox-mail.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class InboxMailComponent {
  inboxUsers = userData
}
