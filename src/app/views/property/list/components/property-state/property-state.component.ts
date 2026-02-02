import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { CommonModule } from '@angular/common'

interface StatItem {
  title: string
  amount: number
  icon: string
  variant: string
  change: number
}

@Component({
  selector: 'property-state',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './property-state.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PropertyStateComponent {
  @Input() stats: StatItem[] = []
}
