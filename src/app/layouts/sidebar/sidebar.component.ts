import { CommonModule } from '@angular/common'
import { Component, inject, type OnInit, OnDestroy } from '@angular/core'
import { MENU_ITEMS, type MenuItemType } from '@common/menu-meta'
import { SimplebarAngularModule } from 'simplebar-angular'
import { NgbCollapseModule, type NgbCollapse } from '@ng-bootstrap/ng-bootstrap'
import { NavigationEnd, Router, RouterModule } from '@angular/router'
import { basePath } from '@common/constants'
import { Store } from '@ngrx/store'
import { findAllParent, findMenuItem } from '@core/helper/utils'
import { LogoBoxComponent } from '@component/logo-box.component'
import { changesidebarsize } from '@store/layout/layout-action'
import { getSidebarsize } from '@store/layout/layout-selector'
import { TranslateModule } from '@ngx-translate/core'
import { AuthenticationService } from '@core/services/auth.service'

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SimplebarAngularModule,
    CommonModule,
    NgbCollapseModule,
    RouterModule,
    LogoBoxComponent,
    TranslateModule

  ],
  templateUrl: './sidebar.component.html',
  styles: ``,
})
export class SidebarComponent implements OnInit, OnDestroy {
  menuItems: MenuItemType[] = []
  activeMenuItems: string[] = []
  private lastRole: string = ''
  private roleCheckInterval: any

  router = inject(Router)
  authService = inject(AuthenticationService)
  trimmedURL = this.router.url?.replaceAll(
    basePath !== '' ? basePath + '/' : '',
    '/'
  )

  store = inject(Store)

  constructor() {
    console.log('🔨 Sidebar component constructed')
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.trimmedURL = this.router.url?.replaceAll(
          basePath !== '' ? basePath + '/' : '',
          '/'
        )
        this._activateMenu()
        setTimeout(() => {
          this.scrollToActive()
        }, 200)
      }
    })
  }

  ngOnInit(): void {
    console.log('📍 Sidebar ngOnInit - Initializing menu with role:', this.authService.userRole)
    this.initMenu()
    // Check for role changes every 500ms to handle login scenario
    this.roleCheckInterval = setInterval(() => {
      this.checkAndUpdateRole()
    }, 500)
    console.log('⏱️ Role check interval started')
  }

  ngOnDestroy(): void {
    if (this.roleCheckInterval) {
      clearInterval(this.roleCheckInterval)
      console.log('⏱️ Role check interval cleared')
    }
  }

  private checkAndUpdateRole(): void {
    const currentRole = this.authService.userRole
    if (currentRole !== this.lastRole) {
      console.log('🔄 Role changed detected. Old:', this.lastRole, 'New:', currentRole)
      this.lastRole = currentRole
      this.initMenu()
    }
  }

  /**
   * Filter menu items based on user role
   */
  filterMenuByRole(items: MenuItemType[]): MenuItemType[] {
    const userRole = this.authService.userRole
    console.log('📋 FILTER START - User role:', userRole, '| Items count:', items.length)
    
    const filtered = items
      .filter((menu) => {
        // If no role is specified, show it to everyone
        if (!menu.role) {
          console.log(`✅ "${menu.label}" - no role set → SHOW to ${userRole}`)
          return true
        }
        
        // If role is 'all', show to everyone
        if (menu.role === 'all') {
          console.log(`✅ "${menu.label}" - role=all → SHOW to ${userRole}`)
          return true
        }
        
        // Admin sees everything
        if (userRole === 'admin') {
          console.log(`✅ "${menu.label}" - admin user → SHOW all menus`)
          return true
        }
        
        // Check if menu role matches user role (non-admin users)
        const matches = menu.role === userRole
        console.log(`${matches ? '✅' : '❌'} "${menu.label}" - menu.role="${menu.role}" vs userRole="${userRole}" → ${matches ? 'SHOW' : 'HIDE'}`)
        
        // IMPORTANT: Return matches - this means only show if roles match exactly (unless admin or 'all')
        return matches
      })
      .map((menu) => ({
        ...menu,
        children: menu.children ? this.filterMenuByRole(menu.children) : undefined,
      }))
    
    console.log('📋 FILTER END - Showing', filtered.length, 'items to', userRole)
    filtered.forEach(m => console.log('  ✅ WILL SHOW:', m.label))
    items.forEach(m => {
      if (!filtered.find(f => f.key === m.key)) {
        console.log('  ❌ WILL HIDE:', m.label)
      }
    })
    return filtered
  }

  initMenu(): void {
    const currentRole = this.authService.userRole
    console.log('═══════════════════════════════════════')
    console.log('🔧 initMenu - Current role:', currentRole)
    console.log('═══════════════════════════════════════')
    this.menuItems = this.filterMenuByRole(MENU_ITEMS)
    console.log('═══════════════════════════════════════')
    console.log('📊 Final filtered menus count:', this.menuItems.length)
    console.log('📊 Final menus:', this.menuItems.map(m => m.label).join(', '))
    console.log('═══════════════════════════════════════\n')
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this._activateMenu()
    })
    setTimeout(() => {
      this.scrollToActive()
    }, 200)
  }

  hasSubmenu(menu: MenuItemType): boolean {
    return menu.children ? true : false
  }

  scrollToActive(): void {
    const activatedItem = document.querySelector('.nav-item li a.active')
    if (activatedItem) {
      const simplebarContent = document.querySelector(
        '.main-nav .simplebar-content-wrapper'
      )
      if (simplebarContent) {
        const activatedItemRect = activatedItem.getBoundingClientRect()
        const simplebarContentRect = simplebarContent.getBoundingClientRect()
        const activatedItemOffsetTop =
          activatedItemRect.top + simplebarContent.scrollTop
        const centerOffset =
          activatedItemOffsetTop -
          simplebarContentRect.top -
          simplebarContent.clientHeight / 2 +
          activatedItemRect.height / 2
        this.scrollTo(simplebarContent, centerOffset, 600)
      }
    }
  }

  easeInOutQuad(t: number, b: number, c: number, d: number): number {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t + b
    t--
    return (-c / 2) * (t * (t - 2) - 1) + b
  }

  scrollTo(element: Element, to: number, duration: number): void {
    const start = element.scrollTop
    const change = to - start
    const increment = 20
    let currentTime = 0

    const animateScroll = () => {
      currentTime += increment
      const val = this.easeInOutQuad(currentTime, start, change, duration)
      element.scrollTop = val
      if (currentTime < duration) {
        setTimeout(animateScroll, increment)
      }
    }
    animateScroll()
  }

  _activateMenu(): void {
    const div = document.querySelector('.navbar-nav')

    let matchingMenuItem = null

    if (div) {
      let items: any = div.getElementsByClassName('nav-link-ref')
      for (let i = 0; i < items.length; ++i) {
        if (
          this.trimmedURL === items[i].pathname ||
          (this.trimmedURL.startsWith('/invoice/') &&
            items[i].pathname === '/invoice/RB6985') ||
          (this.trimmedURL.startsWith('/ecommerce/product/') &&
            items[i].pathname === '/ecommerce/product/1')
        ) {
          matchingMenuItem = items[i]
          break
        }
      }

      if (matchingMenuItem) {
        const mid = matchingMenuItem.getAttribute('aria-controls')
        const activeMt = findMenuItem(this.menuItems, mid)

        if (activeMt) {
          const matchingObjs = [
            activeMt['key'],
            ...findAllParent(this.menuItems, activeMt),
          ]

          this.activeMenuItems = matchingObjs
          this.menuItems.forEach((menu: MenuItemType) => {
            menu.collapsed = !matchingObjs.includes(menu.key!)
          })
        }
      }
    }
  }

  /**
   * toggles open menu
   * @param menuItem clicked menuitem
   * @param collapse collpase instance
   */
  toggleMenuItem(menuItem: MenuItemType, collapse: NgbCollapse): void {
    collapse.toggle()
    let openMenuItems: string[]
    if (!menuItem.collapsed) {
      openMenuItems = [
        menuItem['key'],
        ...findAllParent(this.menuItems, menuItem),
      ]
      this.menuItems.forEach((menu: MenuItemType) => {
        if (!openMenuItems.includes(menu.key!)) {
          menu.collapsed = true
        }
      })
    }
  }

  changeMenuSize() {
    let size = document.documentElement.getAttribute('data-menu-size')
    if (size == 'sm-hover') {
      size = 'sm-hover-active'
    } else {
      size = 'sm-hover'
    }
    this.store.dispatch(changesidebarsize({ size }))
    this.store.select(getSidebarsize).subscribe((size) => {
      document.documentElement.setAttribute('data-menu-size', size)
    })
  }
}
