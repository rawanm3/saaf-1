import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Inject,
  inject,
  OnInit,
  Output,
} from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { Store } from '@ngrx/store'
import { changetheme } from '@store/layout/layout-action'
import { getLayoutColor } from '@store/layout/layout-selector'
import { SimplebarAngularModule } from 'simplebar-angular'
import { notificationsData } from './data'
import { CommonModule, DOCUMENT } from '@angular/common'
import { logout } from '@store/authentication/authentication.actions'
import { TranslateModule } from '@ngx-translate/core'
import { LanguageService } from '@core/services/language.service'
import { NotificationService } from '@core/services/notification.service'
import { Notification } from '../../core/models/notification.model'; 


type FullScreenTypes = {
  requestFullscreen?: () => Promise<void>
  mozRequestFullScreen?: () => Promise<void>
  mozCancelFullScreen?: () => Promise<void>
  msExitFullscreen?: () => Promise<void>
  webkitExitFullscreen?: () => Promise<void>
  mozFullScreenElement?: Element
  msFullscreenElement?: Element
  webkitFullscreenElement?: Element
  msRequestFullscreen?: () => Promise<void>
  mozRequestFullscreen?: () => Promise<void>
  webkitRequestFullscreen?: () => Promise<void>
}

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [SimplebarAngularModule, NgbDropdownModule,TranslateModule, CommonModule ],
  templateUrl: './topbar.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [`
    .language-dropdown .dropdown-toggle {
      border: 1px solid var(--bs-border-color);
      background: var(--bs-body-bg);
      color: var(--bs-body-color);
      transition: all 0.3s ease;
    }
    
    .language-dropdown .dropdown-toggle:hover {
      border-color: var(--bs-primary);
      background: var(--bs-primary-bg-subtle);
    }
    
    .language-dropdown .dropdown-item {
      transition: all 0.2s ease;
      border-radius: 6px;
      margin: 2px 4px;
    }
    
    .language-dropdown .dropdown-item:hover {
      background: var(--bs-primary-bg-subtle);
      color: var(--bs-primary);
    }
    
    .language-dropdown .dropdown-item.active {
      background: var(--bs-primary-bg-subtle);
      color: var(--bs-primary);
    }
    
    .language-flag {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class TopbarComponent implements OnInit {
  element!: FullScreenTypes
  isRTL = false;
  notificationList: Notification[] = []; 
  unreadCount: number = 0;


  @Output() settingsButtonClicked = new EventEmitter()
  @Output() mobileMenuButtonClicked = new EventEmitter()

  router = inject(Router)
  store = inject(Store)
  languageService = inject(LanguageService);
  NotificationService = inject(NotificationService);

  constructor(@Inject(DOCUMENT) private document: Document & FullScreenTypes) {
    this.element = this.document.documentElement as FullScreenTypes

    this.languageService.currentLang$.subscribe((lang: string) => {
      this.isRTL = lang === 'ar';
    });
  }

  settingMenu() {
    this.settingsButtonClicked.emit()
  }

  toggleMobileMenu() {
    this.mobileMenuButtonClicked.emit()
  }

  changeTheme() {
    const color = document.documentElement.getAttribute('data-bs-theme')
    if (color == 'light') {
      this.store.dispatch(changetheme({ color: 'dark' }))
    } else {
      this.store.dispatch(changetheme({ color: 'light' }))
    }
    this.store.select(getLayoutColor).subscribe((color) => {
      document.documentElement.setAttribute('data-bs-theme', color)
    })
  }


  logout() {
    this.store.dispatch(logout())
  }
  
ngOnInit(): void {
    this.fetchNotifications();

    this.NotificationService.onNewNotification().subscribe((data) => {
      // Safety check: ensure message exists, trim whitespace, and check content
      const msg = (data.message || '').trim();

      // If the message contains the specific text, ignore it
      if (msg.includes('تم إضافة عقار جديد')) {
        return; 
      }

      const newNotif = {
        _id: data.property._id || 'temp_id', 
        message: data.message,
        property: data.property,
        seen: false,
        createdAt: new Date()
      };

      this.notificationList.unshift(newNotif);
      this.unreadCount++;
    });
  }

  fetchNotifications() {
    this.NotificationService.getNotifications().subscribe({
      next: (data) => {
        // Filter the list immediately upon fetching
        this.notificationList = data.filter(n => {
          const msg = (n.message || '').trim();
          // Keep only notifications that DO NOT include the specific text
          return !msg.includes('تم إضافة عقار جديد');
        });

        this.unreadCount = this.notificationList.filter(n => !n.seen).length;
      },
      error: (err) => console.error('Error fetching notifications:', err)
    });
  }

  clearAllNotifications() {
    if (this.unreadCount === 0) return;

    this.NotificationService.markAllAsRead().subscribe({
      next: () => {
        this.unreadCount = 0;
        this.notificationList.forEach(n => n.seen = true);
      },
      error: (err) => console.error(err)
    });
  }
  
  getIcon(item: any): string {
    return 'assets/images/users/avatar-1.jpg'; 
  }
// Update the type of 'id' to allow undefined
  markItemAsRead(id: string | undefined, index: number) {
    
    // Safety check: if id is missing or item is already seen, stop here.
    if (!id || this.notificationList[index].seen) {
      return;
    }

    this.NotificationService.markOneAsRead(id).subscribe({
      next: (res) => {
        this.notificationList[index].seen = true;
        if (this.unreadCount > 0) {
          this.unreadCount--;
        }
      },
      error: (err) => {
        console.error('Failed to mark as read', err);
      }
    });
  }
}
