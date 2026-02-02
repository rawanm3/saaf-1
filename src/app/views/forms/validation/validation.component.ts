import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators,
  type UntypedFormGroup,
} from '@angular/forms'
import { PageTitleComponent } from '@component/page-title.component'
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component'

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [
    PageTitleComponent,
    UIExamplesListComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './validation.component.html',
  styles: ``,
})
export class ValidationComponent {
  validationform!: UntypedFormGroup
  tooltipvalidationform!: UntypedFormGroup
  supportedForm!: UntypedFormGroup
  submit!: boolean
  formsubmit!: boolean

  public formBuilder = inject(UntypedFormBuilder)

  ngOnInit(): void {
    this.validationform = this.formBuilder.group({
      firstName: [
        'Mark',
        [Validators.required, Validators.pattern('[a-zA-Z0-9]+')],
      ],
      lastName: [
        'Otto',
        [Validators.required, Validators.pattern('[a-zA-Z0-9]+')],
      ],
      username: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      city: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      state: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      zip: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      agree: ['', [Validators.required]],
    })

    this.tooltipvalidationform = this.formBuilder.group({
      firstName: [
        'Mark',
        [Validators.required, Validators.pattern('[a-zA-Z0-9]+')],
      ],
      lastName: [
        'Otto',
        [Validators.required, Validators.pattern('[a-zA-Z0-9]+')],
      ],
      userName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      city: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      state: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      zip: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
    })
  }

  validSubmit() {
    this.submit = true
  }

  get form() {
    return this.validationform.controls
  }

  formSubmit() {
    this.formsubmit = true
  }

  get formData() {
    return this.tooltipvalidationform.controls
  }
}
