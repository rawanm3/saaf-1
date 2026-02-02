import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PropertyService } from '@core/services/property.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-distribution-list',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './distribution-list.component.html',
styleUrls: ['./distribution-list.component.scss']
})
export class DistributionListComponent {
  pendingCycles: any[] = [];
  loading = true;

  constructor(
    private distService: PropertyService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadPending();
  }

loadPending() {
  this.loading = true;
  this.distService.getPendingDistributions().subscribe({
    next: (res: any) => {
      this.pendingCycles = res.pendingCycles || res.data || res || [];
      this.loading = false;
    },
    error: (err: any) => {
      this.loading = false;
    }
  });
}


  getPendingDistributions(cycle: any) {
    return cycle.distributions?.filter((d: any) => d.distributionStatus === 'pending') || [];
  }

updateDistribution(cycleId: string, investorId: string, action: 'approve' | 'reject') {
  const confirmText = action === 'approve'
    ? this.translate.instant('DISTRIBUTIONS.APPROVE_CONFIRM')
    : this.translate.instant('DISTRIBUTIONS.REJECT_CONFIRM');

  Swal.fire({
    title: confirmText,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: this.translate.instant('COMMON.YES'),
    cancelButtonText: this.translate.instant('COMMON.CANCEL'),
    confirmButtonColor: action === 'approve' ? '#198754' : '#dc3545'
  }).then(result => {
    if (result.isConfirmed) {
      this.distService.updatePendingDistribution(cycleId, investorId, action).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: action === 'approve'
              ? this.translate.instant('DISTRIBUTIONS.APPROVED_SUCCESS')
              : this.translate.instant('DISTRIBUTIONS.REJECTED_SUCCESS'),
            timer: 2000,
            showConfirmButton: false
          });
          this.loadPending();
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: this.translate.instant('COMMON.ERROR'),
            text: this.translate.instant('COMMON.TRY_AGAIN')
          });
        }
      });
    }
  });
}

}
