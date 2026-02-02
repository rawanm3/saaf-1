import { bootstrapApplication } from '@angular/platform-browser'
import { appConfig } from './app/app.config'
import { AppComponent } from './app/app.component'
import 'iconify-icon'
import 'simplebar'
import { TranslateService } from '@ngx-translate/core'

bootstrapApplication(AppComponent, appConfig).then(appRef => {
  const translate = appRef.injector.get(TranslateService);
  translate.addLangs(['en', 'ar']);
  translate.setDefaultLang('en');
  translate.use('en');
});