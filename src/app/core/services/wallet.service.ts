import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'

export interface PendingPaymentsResponse {
  pendingDeposits: any[]
  pendingWithdraws: any[]
}

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private apiUrl = 'https://saaf.net.sa/api/wallet'

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token')
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    })
  }

  getPendingPayments(): Observable<PendingPaymentsResponse> {
    return this.http.get<PendingPaymentsResponse>(
      `${this.apiUrl}/pending-payments`,
      { headers: this.getAuthHeaders() }
    )
  }

  approveDeposit(paymentId: string): Observable<any> {
    console.log('Calling approveDeposit with', paymentId)
    return this.http.post(
      `${this.apiUrl}/approve-deposit`,
      { paymentId },
      { headers: this.getAuthHeaders() }
    )
  }

  approveWithdraw(paymentId: string): Observable<any> {
    console.log('Calling approveWithdraw with', paymentId)
    return this.http.post(
      `${this.apiUrl}/approve-withdraw`,
      { paymentId },
      { headers: this.getAuthHeaders() }
    )
  }

  rejectDeposit(paymentId: string, reason: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/deposit/reject`,
      { paymentId, reason },
      { headers: this.getAuthHeaders() }
    )
  }

  rejectWithdraw(paymentId: string, reason: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/withdraw/reject`,
      { paymentId, reason },
      { headers: this.getAuthHeaders() }
    )
  }

  updateAmount(paymentId: string, data: { amount: number }): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-amount/${paymentId}`, data, {
      headers: this.getAuthHeaders(),
    })
  }
}
