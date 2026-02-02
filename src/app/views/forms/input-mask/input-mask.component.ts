import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask'

@Component({
  selector: 'app-input-mask',
  standalone: true,
  imports: [PageTitleComponent, NgxMaskPipe, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './input-mask.component.html',
  providers: [provideNgxMask()],
})
export class InputMaskComponent {}
