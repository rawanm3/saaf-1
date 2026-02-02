import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
// import { CustomerService } from '@core/services/customer.service';
import { Subscription } from 'rxjs';
import { CustomersService } from '@core/services/customers.service';

@Component({
  selector: 'customer-investments',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  template: `
    <div class="investments-container">
      <h5 class="mb-3">Investments</h5>
      
      <div *ngIf="isLoading" class="text-center">
        <div class="spinner-border spinner-border-sm" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Loading investments...</p>
      </div>

      <div *ngIf="!isLoading && errorMessage" class="alert alert-danger">
        {{ errorMessage }}
        <button class="btn btn-sm btn-outline-danger ms-2" (click)="retryLoad()">Retry</button>
      </div>

      <div *ngIf="!isLoading && !errorMessage && investments.length > 0" class="investments-list">
        <div *ngFor="let investment of investments; trackBy: trackByFn" 
             class="investment-item p-3 mb-3 border rounded">
          
          <div class="row">
            <div class="col-md-8">
              <h6 class="mb-2">{{ investment.property?.name || 'Unknown Property' }}</h6>
              <p class="mb-1 text-muted small">
                <i class="ri-map-pin-line me-1"></i>
                {{ investment.property?.location || 'Location not specified' }}
              </p>
              <p class="mb-1 text-muted small">
                <i class="ri-building-line me-1"></i>
                {{ investment.property?.type || 'Property type not specified' }}
              </p>
            </div>
            <div class="col-md-4 text-end">
              <span class="badge fs-6" 
                    [class.bg-success]="investment.status === 'active'"
                    [class.bg-warning]="investment.status === 'pending'"
                    [class.bg-secondary]="investment.status === 'exited'"
                    [class.bg-danger]="investment.status === 'cancelled'">
                {{ investment.status | titlecase }}
              </span>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-3">
              <div class="investment-detail">
                <small class="text-muted">Amount Invested</small>
                <div class="fw-bold text-success">
                  {{ investment.amountInvested | currency:'SAR' }}
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="investment-detail">
                <small class="text-muted">Shares Purchased</small>
                <div class="fw-bold">{{ investment.sharesPurchased }}</div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="investment-detail">
                <small class="text-muted">Share Price</small>
                <div class="fw-bold">
                  {{ investment.property?.sharePrice | currency:'SAR' }}
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="investment-detail">
                <small class="text-muted">Investment Date</small>
                <div class="fw-bold">
                  {{ investment.investmentDate | date:'short' }}
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="investment.dividendsReceived > 0" class="row mt-2">
            <div class="col-12">
              <div class="alert alert-info py-2">
                <small>
                  <i class="ri-money-dollar-circle-line me-1"></i>
                  <strong>Dividends Received:</strong> {{ investment.dividendsReceived | currency:'SAR' }}
                </small>
              </div>
            </div>
          </div>

          <div *ngIf="investment.exitInfo" class="row mt-2">
            <div class="col-12">
              <div class="alert alert-secondary py-2">
                <small>
                  <i class="ri-logout-circle-line me-1"></i>
                  <strong>Exit Date:</strong> {{ investment.exitInfo.exitDate | date:'short' }} |
                  <strong>Amount Returned:</strong> {{ investment.exitInfo.amountReturned | currency:'SAR' }} |
                  <strong>Profit:</strong> {{ investment.exitInfo.profit | currency:'SAR' }}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!isLoading && !errorMessage && investments.length === 0" class="text-center text-muted">
        <div class="py-4">
          <i class="ri-investment-line" style="font-size: 3rem; opacity: 0.3;"></i>
          <p class="mt-2">No investments found for this customer</p>
          <p class="small">Investments will appear here once the customer makes some.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .investment-item {
      background-color: #f8f9fa;
      transition: box-shadow 0.2s ease;
    }
    .investment-item:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .investment-detail {
      text-align: center;
    }
  `]
})
export class InvestmentsComponent implements OnInit, OnDestroy {
  @Input() userId!: string;

  investments: any[] = [];
  isLoading = false;
  errorMessage = '';
  private subscription?: Subscription;

  constructor(private customerService: CustomersService) {}

  ngOnInit(): void {
    if (this.userId) {
      this.loadInvestments();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private loadInvestments(): void {
    if (!this.userId) {
      this.errorMessage = 'User ID is required to load investments';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.investments = [];

    this.subscription = this.customerService.getInvestmentsByUserId(this.userId).subscribe({
      next: (investments: any[]) => {
        console.log('✅ Investments loaded successfully:', investments);
        this.investments = investments || [];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('❌ Error loading investments:', error);
        this.errorMessage = `Failed to load investments: ${error.message || 'Unknown error'}`;
        this.isLoading = false;
        this.investments = [];
      }
    });
  }

  retryLoad(): void {
    this.loadInvestments();
  }

  trackByFn(index: number, item: any): any {
    return item._id || item.id || index;
  }
}
