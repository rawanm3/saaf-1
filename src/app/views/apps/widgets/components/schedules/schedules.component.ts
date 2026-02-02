import { Component } from '@angular/core'
import { scheduleData } from '../../data'
import { CommonModule } from '@angular/common'
import { NgbAlertModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'widgets-schedules',
  standalone: true,
  imports: [CommonModule, NgbAlertModule, NgbDropdownModule],
  templateUrl: './schedules.component.html',
  styles: ``,
})
export class SchedulesComponent {
  scheduleData = scheduleData
}
