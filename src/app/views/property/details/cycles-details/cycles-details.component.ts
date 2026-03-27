import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertyService } from '@core/services/property.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthenticationService } from '@core/services/auth.service';

@Component({
  selector: 'app-cycles-details',
  templateUrl: './cycles-details.component.html',
  standalone: true,
  imports: [TranslateModule, CommonModule, ReactiveFormsModule, FormsModule],
  providers: [DatePipe],
})
export class CyclesDetailsComponent implements OnInit {
  @Input() propertyId!: string;

  investors: any[] = [];
  propertyFinancials: any = null; 
  loading = false;
  pdfLoading = false;
  submittingRevenue = false;
  revenueForm!: FormGroup;
currentPage = 1;
itemsPerPage = 5; // أو 10 حسب ما تحبي
totalPages = 0;
  constructor(
    private propertyService: PropertyService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('propertyId');
      if (id) {
        this.propertyId = id;
        this.initRevenueForm();
        this.loadData();
      }
    });
  }

  loadData(): void {
    this.loading = true;
    // نعتمد على payout-details لأنها تحتوي على كل شيء (العقار + المستثمرين)
    this.propertyService.getPropertyPayoutDetails(this.propertyId).subscribe({
      next: (res: any) => {
  this.propertyFinancials = res;
  this.investors = res.investors || [];

  // 👇 pagination
  this.totalPages = Math.ceil(this.investors.length / this.itemsPerPage);
  this.currentPage = 1;

  this.loading = false;
  this.cdr.detectChanges();
},
      error: (err) => {
        this.loading = false;
        console.error('Error loading data', err);
      }
    });
  }

  private initRevenueForm(): void {
    this.revenueForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(1)]],
      totalexpense: [0, [Validators.min(0)]],
      notes: ['']
    });
  }
  get paginatedInvestors() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  return this.investors.slice(start, start + this.itemsPerPage);
}

  get netRevenue(): number {
    const amount = Number(this.revenueForm.get('amount')?.value || 0);
    const expenses = Number(this.revenueForm.get('totalexpense')?.value || 0);
    return amount - expenses;
  }

  downloadPayoutPDF(): void {
    this.pdfLoading = true;
    this.propertyService.generatePropertyPayoutPDF(this.propertyId).subscribe({
      next: (res: any) => {
        this.pdfLoading = false;
        if (res && res.file) {
          const link = document.createElement('a');
          link.href = res.file;
          link.target = '_blank';
          link.download = `Report_${this.propertyId}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      },
      error: () => { this.pdfLoading = false; Swal.fire('Error', 'Could not generate PDF', 'error'); }
    });
  }

  submitRevenue(): void {
    if (this.revenueForm.invalid) return;
    this.submittingRevenue = true;

    const payload = { propertyId: this.propertyId, ...this.revenueForm.value };

    this.propertyService.addToMasterWallet(payload).subscribe({
      next: () => {
        this.submittingRevenue = false;
        Swal.fire({ icon: 'success', title: this.translate.instant('PROPERTY.REVENUE_ADDED_SUCCESSFULLY'), timer: 2000 });
        this.revenueForm.reset({ totalexpense: 0 });
        this.loadData();
      },
      error: (err) => {
        this.submittingRevenue = false;
        Swal.fire('Error', err.error?.message, 'error');
      }
    });
  }

  toggleTransfer(inv: any): void {
    inv.showTransfer = !inv.showTransfer;
    if (inv.showTransfer) {
      inv.transferAmount = null;
      inv.transferNotes = '';
    }
  }

submitTransfer(inv: any): void {
    // محاولة التقاط المعرف من أكثر من مكان متوقع
const id = inv.investorId;
    if (!id) {
      console.error('لم يتم العثور على معرف للمستثمر في الكائن التالي:', inv);
      Swal.fire('Error', this.translate.instant('PROPERTY.MISSING_INVESTOR_ID'), 'error');
      return;
    }

    if (!inv.transferAmount || inv.transferAmount <= 0) {
      Swal.fire('Error', this.translate.instant('PROPERTY.INVALID_AMOUNT'), 'error');
      return;
    }

    const payload = {
      investorId: id, // تأكد أن السيرفر يتوقع هذا المسمى "investorId"
      propertyId: this.propertyId,
      amount: inv.transferAmount,
      notes: inv.transferNotes || ''
    };

    this.propertyService.transferToInvestor(payload).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: this.translate.instant('PROPERTY.TRANSFER_SUCCESS'), timer: 2000 });
        inv.showTransfer = false;
        this.loadData();
      },
      error: (err) => {
        Swal.fire('Error', err.error?.message || this.translate.instant('PROPERTY.TRANSFER_FAILED'), 'error');
      }
    });
}
  isAuthorized(): boolean {
    const role = this.authService.userRole;
    return role === 'admin' || role === 'accountant';
  }
}