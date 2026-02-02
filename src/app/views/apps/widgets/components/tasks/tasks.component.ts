import { Component } from '@angular/core'
import { TaskData } from '../../data'
import { CommonModule } from '@angular/common'
import { SimplebarAngularModule } from 'simplebar-angular'

@Component({
  selector: 'widgets-tasks',
  standalone: true,
  imports: [CommonModule, SimplebarAngularModule],
  templateUrl: './tasks.component.html',
  styles: ``,
})
export class TasksComponent {
  taskList = TaskData
}
