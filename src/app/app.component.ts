import { CommonModule } from '@angular/common'
import { Component, inject, ViewChild, type OnInit } from '@angular/core'
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
  type Event,
} from '@angular/router'
import { TitleService } from '@core/services/title.service'
import { TranslateModule } from '@ngx-translate/core'
import {
  NgProgressComponent,
  NgProgressModule,
  type NgProgressRef,
} from 'ngx-progressbar'
import { LanguageService } from '@core/services/language.service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgProgressModule, CommonModule, TranslateModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isRTL = false
  title(title: any) {
    throw new Error('Method not implemented.')
  }
  progressRef!: NgProgressRef
  @ViewChild(NgProgressComponent) progressBar!: NgProgressComponent

  private titleService = inject(TitleService)
  private router = inject(Router)

  constructor() {
    this.router.events.subscribe((event: Event) => {
      this.checkRouteChange(event)
    })
  }

  ngOnInit(): void {
    this.titleService.init()
  }

  checkRouteChange(routerEvent: Event) {
    if (routerEvent instanceof NavigationStart) {
      this.progressBar.start()
    }
    if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ) {
      setTimeout(() => {
        this.progressBar.complete()
      }, 200)
    }
  }
}
