import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { stateData } from '../../data'
import { currency } from '@common/constants'

@Component({
  selector: 'widgets-state',
  standalone: true,
  imports: [],
  templateUrl: './state.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StateComponent {
  stateData = stateData
  currency = currency
}
