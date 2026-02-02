import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { statisticData } from '../../data'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'widgets-state2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './state2.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class State2Component {
  statisticData = statisticData
}
