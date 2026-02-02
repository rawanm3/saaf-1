import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { AgentCardComponent } from './components/agent-card/agent-card.component'
import { FileUploaderComponent } from '@component/file-uploader/file-uploader.component'
import { AgentInfoComponent } from './components/agent-info/agent-info.component'

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    PageTitleComponent,
    AgentCardComponent,
    FileUploaderComponent,
    AgentInfoComponent,
  ],
  templateUrl: './add.component.html',
  styles: ``,
})
export class AddComponent {}
