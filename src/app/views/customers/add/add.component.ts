import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { CustomerInfoComponent } from './customer-info/customer-info.component'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [PageTitleComponent, CustomerInfoComponent, TranslateModule],
  templateUrl: './add.component.html',
  styles: ``,
})
export class AddComponent {}
