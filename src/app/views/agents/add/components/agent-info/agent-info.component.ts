import { Component } from '@angular/core'
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive'

@Component({
  selector: 'agent-info',
  standalone: true,
  imports: [SelectFormInputDirective],
  templateUrl: './agent-info.component.html',
  styles: ``,
})
export class AgentInfoComponent {}
