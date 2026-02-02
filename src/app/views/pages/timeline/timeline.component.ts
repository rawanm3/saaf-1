import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { timelineData } from './data'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [PageTitleComponent, CommonModule],
  templateUrl: './timeline.component.html',
  styles: ``,
})
export class TimelineComponent {
  timelines = timelineData
}
