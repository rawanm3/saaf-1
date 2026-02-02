import { Component, inject } from '@angular/core'
import {
  NgbAccordionModule,
  NgbActiveOffcanvas,
} from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular'

@Component({
  selector: 'app-chat-setting',
  standalone: true,
  imports: [NgbAccordionModule, SimplebarAngularModule],
  templateUrl: './chat-setting.component.html',
  styles: `
    :host {
      display: contents !important;
    }
  `,
})
export class ChatSettingComponent {
  activeOffcanvas = inject(NgbActiveOffcanvas)
}
