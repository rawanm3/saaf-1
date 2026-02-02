import { Component } from '@angular/core'
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive'

@Component({
  selector: 'blog-info',
  standalone: true,
  imports: [SelectFormInputDirective],
  templateUrl: './blog-info.component.html',
  styles: ``,
})
export class BlogInfoComponent {}
