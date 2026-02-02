import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { credits, currentYear } from '@common/constants'
import { calculateTimeToEvent } from '@core/helper/utils'
import { interval, type Subscription } from 'rxjs'

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './coming-soon.component.html',
  styles: ``,
})
export class ComingSoonComponent {
  year = currentYear
  credits = credits

  _days?: number
  _hours?: number
  _minutes?: number
  _seconds?: number
  countdown: { days: number; hours: number; minutes: number; seconds: number } =
    {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  private intervalSubscription!: Subscription

  ngOnInit(): void {
    this.countdown = calculateTimeToEvent()
    this.intervalSubscription = interval(1000).subscribe(() => {
      this.countdown = calculateTimeToEvent()
    })
  }

  ngOnDestroy(): void {
    this.intervalSubscription.unsubscribe()
  }
}
