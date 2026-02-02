import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { GridCardsComponent } from './components/grid-cards/grid-cards.component'
import { AgentDataComponent } from './components/agent-data/agent-data.component'

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [PageTitleComponent, GridCardsComponent, AgentDataComponent],
  templateUrl: './grid.component.html',
  styles: ``,
})
export class GridComponent {}
