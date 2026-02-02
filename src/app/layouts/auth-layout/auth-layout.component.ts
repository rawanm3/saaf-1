import {
  ChangeDetectorRef,
  Component,
  inject,
  Renderer2,
  type OnDestroy,
  type OnInit,
} from '@angular/core'
import { RouterModule } from '@angular/router'
import { Subscription } from 'rxjs'
import { LanguageService } from '@core/services/language.service'


@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './auth-layout.component.html',
  styles: ``,
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  renderer = inject(Renderer2)
  private languageService = inject(LanguageService)
  private cdr = inject(ChangeDetectorRef)

 isDarkMode = false
  isRTL = false
  isOpen = false
  private langSub!: Subscription
  ngOnInit(): void {
      this.langSub = this.languageService.currentLang$.subscribe((lang) => {
      this.isRTL = lang === 'ar'
      document.documentElement.dir = this.isRTL ? 'rtl' : 'ltr'
      this.cdr.detectChanges()
    })
    this.renderer.addClass(document.body, 'authentication-bg')
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'authentication-bg')
  }
    toggleLang(): void {
    this.languageService.toggleLanguage()
  }

  switchLanguage(lang: string): void {
    this.languageService.setLanguage(lang)
  }
}
