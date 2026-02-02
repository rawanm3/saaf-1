import {
  Component,
  Input,
  Output,
  EventEmitter,
  CUSTOM_ELEMENTS_SCHEMA,
  OnChanges,
  SimpleChanges,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'
import { RouterModule } from '@angular/router'
import { currency, currentYear } from '@common/constants'
import { Property } from '@core/models/property.model'

@Component({
  selector: 'property-info',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './property-info.component.html',
  styleUrls: ['./property-info.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PropertyInfoComponent implements OnChanges {
  @Input() property!: Property | null
  @Input() editMode: boolean = false

  @Output() save = new EventEmitter<Partial<Property>>()
  @Output() cancel = new EventEmitter<void>()

  currency = currency
  currentYear = currentYear

  editPropertyData: Partial<Property> = {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.editMode && this.property) {
      this.editPropertyData = { ...this.property }
    }
  }

  onSave() {
    this.save.emit(this.editPropertyData)
  }

  onCancel() {
    this.cancel.emit()
  }
}
