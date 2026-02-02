import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  inject,
  Output,
} from '@angular/core'
import { SwiperDirective } from '@component/swiper-directive.component'
import {
  socialGroupsData,
  userData,
  type GroupType,
  type UserType,
} from '../../data'
import { register } from 'swiper/element'
import type { SwiperOptions } from 'swiper/types'
import { NgbNavModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular'
import { DatePipe } from '@angular/common'
import { ChatSettingComponent } from '../chat-setting/chat-setting.component'
register()

@Component({
  selector: 'chat-left-sidebar',
  standalone: true,
  imports: [SwiperDirective, NgbNavModule, SimplebarAngularModule, DatePipe],
  templateUrl: './chat-left-side-bar.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ChatLeftSideBarComponent {
  users = userData
  groupList = socialGroupsData

  @Output() profileDetail = new EventEmitter<UserType>()

  selectedUser = userData[0]
  swiperConfig: SwiperOptions = {
    slidesPerView: 6.0,
    loop: true,
    spaceBetween: 5,
  }

  offcanvasService = inject(NgbOffcanvas)

  ngOnInit(): void {
    // Fetch Data
    const data = this.users[0]
    this.profileDetail.emit(data)
  }

  openSetting(divId: string) {
    const divElement = document.getElementById(divId)!
    if (this.offcanvasService.hasOpenOffcanvas()) {
      this.offcanvasService.open(ChatSettingComponent)
    } else {
      this.offcanvasService.open(ChatSettingComponent, {
        container: divElement,
        panelClass: 'position-absolute shadow w-100',
        backdrop: false,
        scroll: true,
      })
    }
  }

  getDetail(user: UserType) {
    const data = user
    this.profileDetail.emit(data)
  }

  // searchContact() {
  //   this.contactData = ContactList.filter(
  //     (user) =>
  //       user.name.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0
  //   )
  // }
}
