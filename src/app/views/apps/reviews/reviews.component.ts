import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { reviewList } from './data'
import {
  NgbDropdownModule,
  NgbPaginationModule,
  NgbRatingModule,
} from '@ng-bootstrap/ng-bootstrap'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [
    PageTitleComponent,
    NgbPaginationModule,
    NgbDropdownModule,
    CommonModule,
    NgbRatingModule,
  ],
  templateUrl: './reviews.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ReviewsComponent {
  reviews = reviewList
}
