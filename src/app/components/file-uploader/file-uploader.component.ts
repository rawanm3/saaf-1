import { Component, EventEmitter, Input, Output, type OnInit } from '@angular/core'
import {
  DROPZONE_CONFIG,
  DropzoneConfigInterface,
  DropzoneModule,
} from 'ngx-dropzone-wrapper'

type UploadedFile = {
  name: string
  size: number
  type: string
  dataURL?: string
  file?: File
}

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  maxFilesize: 50,
  acceptedFiles: 'image/*',
}

@Component({
  selector: 'FileUploader',
  standalone: true,
  imports: [DropzoneModule],
  template: ` <dropzone
      class="dropzone"
      [config]="dropzoneConfig"
      [message]="dropzone"
    
    ></dropzone>

    @if (uploadedFiles) {
      @for (file of uploadedFiles; track $index) {
        <div class="dropzone-previews mt-3" id="file-previews">
          <div
            class="card mt-1 mb-0 shadow-none border dz-processing dz-success dz-complete dz-image-preview"
          >
            <div class="p-2">
              <div class="row align-items-center">
                <div class="col-auto">
                  <img
                    data-dz-thumbnail=""
                    [src]="file.dataURL"
                    class="avatar-sm rounded bg-light"
                  />
                </div>
                <div class="col ps-0">
                  <a href="javascript:void(0);" class="text-muted fw-bold">{{
                    file.name
                  }}</a>
                  <p class="mb-0" data-dz-size="">
                    <strong>{{ file.size }}</strong> KB
                  </p>
                </div>
                <div class="col-auto">
                  <button
                    (click)="removeFile($index)"
                    class="btn btn-sm btn-primary"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    }`,
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG,
    },
  ],
})
export class FileUploaderComponent {
  @Output() filesSelected = new EventEmitter<File[]>() // ✨ نبعث الملفات للأب
  
  uploadedFiles: UploadedFile[] = []

  dropzoneConfig: DropzoneConfigInterface = {
    url: 'https://httpbin.org/post',
    maxFilesize: 50,
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
  }

  dropzone = ` <div class="dz-message needsclick">
                           <i class="ri-upload-cloud-2-line fs-48 text-primary"></i>
                           <h3>Drop your images here, or <span class="text-primary">click to browse</span></h3>
                           <span class="text-muted fs-13">
                                1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed
                           </span>
                      </div>
`


  // ✨ لما يضاف ملف
  onFileAdded(file: any) {
    const reader = new FileReader()
    reader.onload = () => {
      this.uploadedFiles.push({
        name: file.name,
        size: Math.round(file.size / 1024),
        type: file.type,
        dataURL: reader.result as string,
        file: file,
      })
      this.emitFiles()
    }
    reader.readAsDataURL(file)
  }
   // ✨ لما يتم الحذف
   onFileRemoved(file: any) {
    this.uploadedFiles = this.uploadedFiles.filter(f => f.name !== file.name)
    this.emitFiles()
  }
  
  removeFile(index: number) {
    this.uploadedFiles.splice(index, 1)
    this.emitFiles()
  }

  // ✨ نبعث الملفات للأب
  private emitFiles() {
    const files = this.uploadedFiles.map(f => f.file!) // نرجع File[]
    this.filesSelected.emit(files)
  }
  
}
  // // File Upload
  // imageURL: string = ''
  // onUploadSuccess(event: UploadedFile[]) {
  //   setTimeout(() => {
  //     this.uploadedFiles.push(event[0])
  //   }, 0)
  // }

  // // File Remove
  // removeFile(index: number) {
  //   this.uploadedFiles.splice(index, 1)
  // }