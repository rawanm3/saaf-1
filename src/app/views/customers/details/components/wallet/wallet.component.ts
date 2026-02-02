import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CustomersService } from '@core/services/customers.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'customer-wallet',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="wallet-container">
      <h5 class="mb-3">Wallet Details</h5>

      <div *ngIf="isLoading" class="text-center">
        <div class="spinner-border spinner-border-sm" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Loading wallet...</p>
      </div>

      <div *ngIf="!isLoading && errorMessage" class="alert alert-danger">
        {{ errorMessage }}
        <button
          class="btn btn-sm btn-outline-danger ms-2"
          (click)="retryLoad()"
        >
          Retry
        </button>
      </div>

      <div *ngIf="!isLoading && !errorMessage && wallet" class="wallet-details">
        <div class="row mb-3">
          <div class="col-12">
            <h6>Balances</h6>
            <div
              *ngFor="let balance of wallet.balances"
              class="balance-item p-2 mb-2 border rounded"
            >
              <div class="d-flex justify-content-between align-items-center">
                <span class="fw-semibold">{{ balance.currency }}</span>
                <span class="text-success fw-bold">{{balance.amount | currency : balance.currency}}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          *ngIf="wallet.account && wallet.account.length > 0"
          class="row mb-3"
        >
          <div class="col-12">
            <h6>Account Information</h6>
            <div
              *ngFor="let account of wallet.account"
              class="account-item p-3 mb-2 border rounded"
            >
              <div class="row">
                <div class="col-md-6">
                  <p class="mb-1">
                    <strong>Full Name:</strong> {{ account.fullName }}
                  </p>
                  <p class="mb-1">
                    <strong>Country:</strong> {{ account.country }}
                  </p>
                  <p class="mb-1">
                    <strong>Bank:</strong> {{ account.BankName }}
                  </p>
                  <p class="mb-1">
                    <strong>Branch:</strong> {{ account.branchName }}
                  </p>
                </div>
                <div class="col-md-6">
                  <p class="mb-1"><strong>IBAN:</strong> {{ account.IBAN }}</p>
                  <p class="mb-1">
                    <strong>Account Number:</strong> {{ account.AccountNumber }}
                  </p>
                  <p class="mb-1">
                    <strong>Swift Code:</strong> {{ account.Swiftcode }}
                  </p>
                  <p class="mb-1">
                    <strong>Currency:</strong> {{ account.currency }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          *ngIf="wallet.documents && wallet.documents.length > 0"
          class="row mb-3"
        >
          <div class="col-12">
            <h6>Documents</h6>
            <div class="row">
              <div *ngFor="let doc of wallet.documents" class="col-md-6 mb-3">
                <div class="document-item p-2 border rounded text-center">
                  <img
                    [src]="doc.url"
                    [alt]="doc.type"
                    class="img-fluid rounded"
                    style="max-height: 200px; cursor: pointer;"
                    (click)="openDocument(doc.url)"
                    (error)="onImageError($event)"
                  />
                  <p class="mt-2 mb-0 small text-muted">
                    {{ doc.type | titlecase }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        *ngIf="!isLoading && !errorMessage && !wallet"
        class="text-center text-muted"
      >
        <p>No wallet found for this customer</p>
      </div>
    </div>
  `,
  styles: [
    `
      .balance-item {
        background-color: #f8f9fa;
      }
      .account-item {
        background-color: #f8f9fa;
      }
      .document-item img {
        transition: transform 0.2s ease;
      }
      .document-item img:hover {
        transform: scale(1.05);
      }
    `,
  ],
})
export class WalletComponent implements OnInit, OnDestroy {
  @Input() userId!: string

  wallet: any = null
  isLoading = false
  errorMessage = ''
  private subscription?: Subscription

  constructor(private CustomersService: CustomersService) {}

  ngOnInit(): void {
    if (this.userId) {
      this.loadWallet()
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  private loadWallet(): void {
    if (!this.userId) {
      this.errorMessage = 'User ID is required to load wallet'
      return
    }

    this.isLoading = true
    this.errorMessage = ''
    this.wallet = null

    this.subscription = this.CustomersService.getWalletByUserId(
      this.userId
    ).subscribe({
      next: (wallet: any) => {
        console.log('Wallet loaded successfully:', wallet)
        this.wallet = wallet
        this.isLoading = false
      },
      error: (error: any) => {
        console.error('Error loading wallet:', error)
        this.errorMessage = `Failed to load wallet: ${
          error.message || 'Unknown error'
        }`
        this.isLoading = false
        this.wallet = null
      },
    })
  }

  retryLoad(): void {
    this.loadWallet()
  }

  openDocument(url: string): void {
    window.open(url, '_blank')
  }

  onImageError(event: any): void {
    console.warn('Failed to load document image')
    event.target.style.display = 'none'
  }
}
