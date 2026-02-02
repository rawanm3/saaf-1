import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { ChatLeftSideBarComponent } from './components/chat-left-side-bar/chat-left-side-bar.component'
import { ChatAreaComponent } from './components/chat-area/chat-area.component'
import type { GroupType, UserType } from './data'

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [PageTitleComponent, ChatLeftSideBarComponent, ChatAreaComponent],
  templateUrl: './messages.component.html',
  styles: ``,
})
export class MessagesComponent {
  profileDetail!: UserType

  receiveDataFromChild(data: UserType) {
    this.profileDetail = data
  }
}
