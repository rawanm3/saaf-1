import { Component } from '@angular/core'
import { FriendRequest } from '../../data'
import { SimplebarAngularModule } from 'simplebar-angular'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'widgets-friend-request',
  standalone: true,
  imports: [SimplebarAngularModule, NgbDropdownModule],
  templateUrl: './friend-request.component.html',
  styles: ``,
})
export class FriendRequestComponent {
  requestList = FriendRequest
}
