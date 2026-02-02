import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { EmailMenuComponent } from './components/email-menu/email-menu.component'
import { InboxMailComponent } from './components/inbox-mail/inbox-mail.component'
import { EmailViewComponent } from './components/email-view/email-view.component'
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [
    PageTitleComponent,
    EmailMenuComponent,
    InboxMailComponent,
    EmailViewComponent,
  ],
  templateUrl: './inbox.component.html',
  styles: ``,
  providers: [NgbActiveOffcanvas],
})
export class InboxComponent {}
