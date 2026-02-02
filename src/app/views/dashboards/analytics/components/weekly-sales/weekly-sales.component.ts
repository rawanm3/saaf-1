import { Component } from '@angular/core'
import { salesOptions } from '../../data'
import { NgApexchartsModule } from 'ng-apexcharts'
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap'
import { PropertyService } from '@core/services/property.service'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'analytics-weekly-sales',
  standalone: true,
  imports: [NgApexchartsModule, NgbCarouselModule, TranslateModule],
  templateUrl: './weekly-sales.component.html',
  styles: ``,
})
export class WeeklySalesComponent {
  weeklyChart = salesOptions
  stats: any;

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.propertyService.getStats().subscribe({
      next: (res) => {
        this.stats = res;
      },
      error: (err) => console.error('Error loading stats:', err),
    });
  }

}
