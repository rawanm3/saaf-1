import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { PropertyService } from '@core/services/property.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-master-wallet-list',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './master-wallet-list.component.html',
    providers: [DatePipe, DecimalPipe]

})
export class MasterWalletListComponent {
 masterData: any = null;
  loading = false;
currentPage = 1;
itemsPerPage = 10;
totalPages = 0;
  constructor(
    private propertyService: PropertyService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadMasterWallet();
  }
get paginatedTransactions() {
  if (!this.masterData?.transactions) return [];

  const start = (this.currentPage - 1) * this.itemsPerPage;
  return this.masterData.transactions.slice(start, start + this.itemsPerPage);
}
loadMasterWallet(): void {
  this.loading = true;

  this.propertyService.getMasterWallet().subscribe({
    next: (res) => {
      this.masterData = res;

      // 👇 هنا تحطي السطر ده
      this.totalPages = Math.ceil(res.transactions.length / this.itemsPerPage);

      this.loading = false;
    },
    error: (err) => {
      this.loading = false;
      console.error('Error fetching wallet:', err);
    }
  });
}

  // دالة لتحديد لون الحالة (Status Badge)
  getStatusClass(status: string): string {
    const statusMap: any = {
      'completed': 'bg-success-subtle text-success',
      'pending': 'bg-warning-subtle text-warning',
      'failed': 'bg-danger-subtle text-danger'
    };
    return statusMap[status?.toLowerCase()] || 'bg-secondary-subtle text-secondary';
  }

  // دالة لتحديد لون نوع العملية (Credit/Debit)
  getTypeClass(type: string): string {
    return type?.toLowerCase() === 'credit' || type?.toLowerCase() === 'deposit' 
      ? 'text-success' 
      : 'text-danger';
  }
}
