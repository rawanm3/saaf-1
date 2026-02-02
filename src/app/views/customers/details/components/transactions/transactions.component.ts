import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
// import { CustomerService } from '@core/services/customer.service';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CustomersService } from '@core/services/customers.service';

@Component({
  selector: 'customer-transactions',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, TranslateModule],
  templateUrl: './transactions.component.html',
})
export class TransactionsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() userId!: string;
  @Input() ibanImageUrl?: string;
  @Input() ibanNumber?: string;
  @Input() walletId?: string;

  transactions: any[] = [];
  displayedTransactions: any[] = [];
  isLoading = false;
  errorMessage = '';
  private subscription?: Subscription;
  maxDisplay = 3;
  showAll = false;

  constructor(private customerService: CustomersService) {}

  ngOnInit(): void {
    console.log('TransactionsComponent initialized with userId:', this.userId);
    if (this.userId) {
      if (!this.walletId) {
        this.customerService.getWalletByUserId(this.userId).subscribe({
          next: (wallet: any) => {
            if (wallet) {
              this.walletId = wallet?._id || wallet?.id || wallet?.walletId || this.walletId;
            }
          },
          error: () => {}
        });
      }
      this.loadTransactions();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId']) {
      console.log('userId changed from', changes['userId'].previousValue, 'to', changes['userId'].currentValue);
      if (changes['userId'].currentValue) {
        if (!this.walletId) {
          this.customerService.getWalletByUserId(this.userId).subscribe({
            next: (wallet: any) => {
              if (wallet) {
                this.walletId = wallet?._id || wallet?.id || wallet?.walletId || this.walletId;
              }
            },
            error: () => {}
          });
        }
        this.loadTransactions();
      } else {
        this.clearTransactions();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private loadTransactions(): void {
    if (!this.userId) {
      console.warn('No userId provided to TransactionsComponent');
      this.errorMessage = 'User ID is required to load transactions';
      return;
    }

    console.log('Loading transactions for userId:', this.userId);
    
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.transactions = [];

    this.subscription = this.customerService.getUserTransactions(this.userId).subscribe({
      next: (transactions: any[]) => {
        console.log('Transactions loaded successfully:', transactions);
        this.transactions = transactions || [];
        this.displayedTransactions = this.showAll ? this.transactions : this.transactions.slice(0, this.maxDisplay);
        if (!this.walletId) {
          const fromTxn = this.transactions.find(t => !!(t?.walletId || t?.wallet?.id || t?.wallet?._id));
          if (fromTxn) {
            this.walletId = fromTxn.walletId || fromTxn.wallet?.id || fromTxn.wallet?._id || this.walletId;
          }
        }
        this.isLoading = false;
        
        if (this.transactions.length === 0) {
          console.log('ℹ No transactions found for user:', this.userId);
        } else {
          console.log(`Found ${this.transactions.length} transactions`);
        }
      },
      error: (error: any) => {
        console.error('Error loading transactions:', error);
        this.errorMessage = `Failed to load transactions: ${error.message || 'Unknown error'}`;
        this.isLoading = false;
        this.transactions = [];
        
        if (error.status === 401) {
          this.errorMessage = 'Authentication failed. Please login again.';
        } else if (error.status === 403) {
          this.errorMessage = 'Access denied. Admin permissions required.';
        } else if (error.status === 404) {
          this.errorMessage = 'Transactions endpoint not found.';
        } else if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please check your connection.';
        }
      }
    });
  }

  private clearTransactions(): void {
    this.transactions = [];
    this.errorMessage = '';
    this.isLoading = false;
  }

  retryLoad(): void {
    this.loadTransactions();
  }

  trackByFn(index: number, item: any): any {
    return item._id || item.id || index;
  }

  isCredit(type: string): boolean {
    const normalized = (type || '').toLowerCase();
    return normalized === 'deposit' || normalized === 'credit' || normalized === 'dividend';
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return '#d4edda';
      case 'pending':
        return '#fff3cd';
      case 'failed':
      case 'cancelled':
        return '#f8d7da';
      default:
        return '#e2e3e5';
    }
  }

  getStatusTextColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return '#155724';
      case 'pending':
        return '#856404';
      case 'failed':
      case 'cancelled':
        return '#721c24';
      default:
        return '#383d41';
    }
  }

  onImageError(): void {
    console.warn('Failed to load IBAN image');
  }

  public refreshTransactions(): void {
    this.loadTransactions();
  }

  toggleViewMore(): void {
    this.showAll = !this.showAll;
    this.displayedTransactions = this.showAll ? this.transactions : this.transactions.slice(0, this.maxDisplay);
  }
}