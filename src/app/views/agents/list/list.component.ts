import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { AgentDataComponent } from './components/agent-data/agent-data.component'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [PageTitleComponent, AgentDataComponent, NgbDropdownModule],
  templateUrl: './list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListComponent {}
