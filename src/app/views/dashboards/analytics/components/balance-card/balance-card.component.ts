import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { propertyData } from '../../data'
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap'
import { currency } from '@common/constants'
import { DashboardService } from '@core/services/dashboard.service'
import { CommonModule } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'analytics-balance-card',
  standalone: true,
  imports: [NgbProgressbarModule,CommonModule, TranslateModule],
  templateUrl: './balance-card.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BalanceCardComponent {
  propertyList = propertyData
  currency = currency
  walletSummary: any;
  propertiesProgress: any;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadWalletSummary();
    this.loadPropertiesProgress();
  }

  loadWalletSummary(): void {
    this.dashboardService.getWalletSummary().subscribe({
      next: (data) => {
        this.walletSummary = data;
      },
      error: (err) => {
        console.error(' Error loading wallet summary:', err);
      }
    });
  }

  loadPropertiesProgress(): void {
    this.dashboardService.getPropertiesProgress().subscribe({
      next: (data) => {
        this.propertiesProgress = data;
      },
      error: (err) => {
        console.error('Error loading properties progress:', err);
      }
    });
  }
}
