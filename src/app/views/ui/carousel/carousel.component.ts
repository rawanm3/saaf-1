import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PageTitleComponent } from '@component/page-title.component'
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component'
import {
  NgbCarouselModule,
  NgbCarouselConfig,
} from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [
    PageTitleComponent,
    UIExamplesListComponent,
    NgbCarouselModule,
    FormsModule,
  ],
  templateUrl: './carousel.component.html',
  styles: ``,
})
export class CarouselComponent {
  constructor(config: NgbCarouselConfig) {
    config.showNavigationArrows = true
    config.showNavigationIndicators = true
  }
}
