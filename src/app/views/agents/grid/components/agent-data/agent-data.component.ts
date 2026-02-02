import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import {
  NgbDropdownModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap'
import { agentData } from '@views/agents/data'

@Component({
  selector: 'grid-agent-data',
  standalone: true,
  imports: [NgbDropdownModule, NgbPaginationModule],
  templateUrl: './agent-data.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AgentDataComponent {
  agentList = agentData
}
