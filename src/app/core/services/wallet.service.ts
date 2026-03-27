import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '@environment/environment'
import { AuthenticationService } from './auth.service'

export interface PendingPaymentsResponse {
  pendingDeposits: any[]
  pendingWithdraws: any[]
}

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private apiUrl = `${environment.apiUrl}/wallet`

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  private get headers() {
    return { Authorization: this.authService.session || this.authService.employeeSession || '' }
  }

  // ─── Deposit / Withdraw ───────────────────────────────────────

  getPendingPayments(): Observable<PendingPaymentsResponse> {
    return this.http.get<PendingPaymentsResponse>(
      `${this.apiUrl}/pending-payments`,
      { headers: this.headers }
    )
  }

  approveDeposit(paymentId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/approve-deposit`,
      { paymentId },
      { headers: this.headers }
    )
  }

  approveWithdraw(paymentId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/approve-withdraw`,
      { paymentId },
      { headers: this.headers }
    )
  }

  rejectDeposit(paymentId: string, reason: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/deposit/reject`,
      { paymentId, reason },
      { headers: this.headers }
    )
  }

  rejectWithdraw(paymentId: string, reason: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/withdraw/reject`,
      { paymentId, reason },
      { headers: this.headers }
    )
  }

  updateAmount(paymentId: string, data: { amount: number }): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/update-amount/${paymentId}`,
      data,
      { headers: this.headers }
    )
  }

  // ─── Pending Distributions ────────────────────────────────────

  getPendingDistributions(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/pending-distributions`,
      { headers: this.headers }
    )
  }

  updatePendingDistribution(transactionId: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/pending-distributions/${transactionId}`,
      {},
      { headers: this.headers }
    )
  }

  // ─── Master Wallet ────────────────────────────────────────────

  addToMasterWallet(data: {
    propertyId: string
    amount: number | null
    totalexpense: number | null
    currency: string
    notes: string
  }): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/master/add`,
      data,
      { headers: this.headers }
    )
  }

  distributeInvestments(data: {
    propertyId: string
    totalAmount: number | null
    currency: string
    notes: string
  }): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/master/distribute`,
      data,
      { headers: this.headers }
    )
  }

  // ─── Master Wallet Info ───────────────────────────────────────

  getMasterWallet(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/master-wallet`,
      { headers: this.headers }
    )
  }
}