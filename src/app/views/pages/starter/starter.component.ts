import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'

@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [PageTitleComponent],
  templateUrl: './starter.component.html',
  styles: ``,
})
export class StarterComponent {}
