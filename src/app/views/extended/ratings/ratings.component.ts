import { Component } from '@angular/core'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { PageTitleComponent } from '@component/page-title.component'
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component'
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-ratings',
  standalone: true,
  imports: [
    PageTitleComponent,
    UIExamplesListComponent,
    NgbRatingModule,
    ReactiveFormsModule,
  ],
  templateUrl: './ratings.component.html',
  styles: ``,
})
export class RatingsComponent {
  basicRating = 5
  rating = 3
  stepRating = 0
  readonly = 3.5
  hovered = 0
  hoverSelected = 1

  ctrl = new FormControl<number | null>(null, Validators.required)
}
