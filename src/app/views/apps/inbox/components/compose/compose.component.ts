import { Component, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NgbActiveModal, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { QuillEditorComponent } from 'ngx-quill'

@Component({
  selector: 'app-compose',
  standalone: true,
  imports: [NgbDropdownModule, QuillEditorComponent, FormsModule],
  templateUrl: './compose.component.html',
  styles: ``,
})
export class ComposeComponent {
  activeModal = inject(NgbActiveModal)
  content = ''
  editorConfig = {
    toolbar: [
      [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ align: [] }],

      ['link', 'image', 'video'],
      ['clean'],
    ],
  }
}
