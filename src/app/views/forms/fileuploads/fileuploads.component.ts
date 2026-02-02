import { Component } from '@angular/core'
import { FileUploaderComponent } from '@component/file-uploader/file-uploader.component'
import { PageTitleComponent } from '@component/page-title.component'
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component'

@Component({
  selector: 'app-fileuploads',
  standalone: true,
  imports: [PageTitleComponent, UIExamplesListComponent, FileUploaderComponent],
  templateUrl: './fileuploads.component.html',
  styles: ``,
})
export class FileuploadsComponent {}
