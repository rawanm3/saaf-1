import { Component } from '@angular/core'
import { StateComponent } from './components/state/state.component'
import { State2Component } from './components/state2/state2.component'
import { RecentProjectComponent } from './components/recent-project/recent-project.component'
import { SchedulesComponent } from './components/schedules/schedules.component'
import { ConversionsComponent } from './components/conversions/conversions.component'
import { TasksComponent } from './components/tasks/tasks.component'
import { FriendRequestComponent } from './components/friend-request/friend-request.component'
import { TransactionsComponent } from './components/transactions/transactions.component'

@Component({
  selector: 'app-widgets',
  standalone: true,
  imports: [
    StateComponent,
    State2Component,
    RecentProjectComponent,
    SchedulesComponent,
    ConversionsComponent,
    TasksComponent,
    FriendRequestComponent,
    TransactionsComponent,
  ],
  templateUrl: './widgets.component.html',
  styles: ``,
})
export class WidgetsComponent {}
