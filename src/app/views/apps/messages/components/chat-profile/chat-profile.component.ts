import { Component, inject, Input } from '@angular/core'
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular'
import type { UserType } from '../../data'

@Component({
  selector: 'chat-profile',
  standalone: true,
  imports: [SimplebarAngularModule],
  templateUrl: './chat-profile.component.html',
  styles: ``,
})
export class ChatProfileComponent {
  activeOffcanvas = inject(NgbActiveOffcanvas)

  @Input() profileDetail!: UserType
}
