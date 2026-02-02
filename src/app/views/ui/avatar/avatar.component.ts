import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component'

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [PageTitleComponent, UIExamplesListComponent],
  templateUrl: './avatar.component.html',
  styles: ``,
})
export class AvatarComponent {}
