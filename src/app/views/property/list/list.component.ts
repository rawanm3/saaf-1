import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { PropertyDataComponent } from './components/property-data/property-data.component'
import { PropertyStateComponent } from './components/property-state/property-state.component'
import { TranslateModule } from '@ngx-translate/core'
import { PropertyService } from '@core/services/property.service'
import { PropertyStats } from '@core/models/property.model'

interface StatItem {
  title: string
  amount: number
  icon: string
  variant: string
  change: number
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    PageTitleComponent,
    PropertyStateComponent,
    PropertyDataComponent,
    TranslateModule,
  ],
  templateUrl: './list.component.html',
  styles: ``,
})
export class ListComponent {
  stats: StatItem[] = []

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.loadStats()
  }

  onPropertyChanged(): void {
    this.loadStats()
  }

  loadStats() {
    this.propertyService.getStats().subscribe({
      next: (res: PropertyStats) => {
        this.stats = [
          {
            title: 'PROPERTY.TOTAL_PROPERTIES',
            amount: res.totalProperties,
            icon: 'ri-building-2-line',
            variant: 'primary',
            change: 0,
          },
          {
            title: 'PROPERTY.AVAILABLE_PROPERTIES',
            amount: res.availableProperties,
            icon: 'ri-home-2-line',
            variant: 'success',
            change: 0,
          },
          {
            title: 'PROPERTY.FUNDED_PROPERTIES',
            amount: res.fundedProperties,
            icon: 'ri-hand-coin-line',
            variant: 'info',
            change: 0,
          },
          {
            title: 'PROPERTY.MATURED_PROPERTIES',
            amount: res.maturedProperties,
            icon: 'ri-time-line',
            variant: 'warning',
            change: 0,
          },
          {
            title: 'PROPERTY.SOLD_PROPERTIES',
            amount: res.soldProperties,
            icon: 'ri-key-line',
            variant: 'danger',
            change: 0,
          },
          {
            title: 'PROPERTY.PENDING_PROPERTIES',
            amount: res.pendingProperties,
            icon: 'ri-hourglass-line',
            variant: 'secondary',
            change: 0,
          },
        ]
      },
      error: (err) => console.error('Error loading stats:', err),
    })
  }
}
