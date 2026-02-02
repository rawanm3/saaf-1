import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private currentLang = new BehaviorSubject<string>('en');
  currentLang$ = this.currentLang.asObservable();

  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('en');
    const savedLang = this.getSavedLanguage() || 'en';
    this.setLanguage(savedLang);
  }

  toggleLanguage() {
    const newLang = this.currentLang.value === 'en' ? 'ar' : 'en';
    this.setLanguage(newLang);
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang.next(lang);
    const isArabic = lang === 'ar';
    document.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('lang', lang);
    this.saveLanguage(lang);
  }

  private saveLanguage(lang: string) {
    try {
      localStorage.setItem('lang', lang);
    } catch {}
  }

  private getSavedLanguage(): string | null {
    try {
      return localStorage.getItem('lang');
    } catch {
      return null;
    }
  }
}
