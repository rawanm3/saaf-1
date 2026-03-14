import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { currentYear } from '../../common/constants'
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './footer.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FooterComponent {
  year = currentYear
}
