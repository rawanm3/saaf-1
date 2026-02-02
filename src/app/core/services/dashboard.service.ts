import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '@environment/environment.prod'
import {
  InvestmentSummary,
  PropertyCycleSummary,
  Transaction,
  Wallet,
  WalletSummary,
  PropertyProgress,
  InvestmentAnalytics,
  CountResponse,
  PendingInvestment,
} from '@core/models/dashboard.model'
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private Baseurl = `${environment.apiUrl}/dashboard`

  constructor(private http: HttpClient) {}

  getInvestmentsSummary(): Observable<InvestmentSummary> {
    return this.http.get<InvestmentSummary>(
      `${this.Baseurl}/investments-summary`
    )
  }

  getPropertyCyclesSummary(): Observable<PropertyCycleSummary[]> {
    return this.http.get<PropertyCycleSummary[]>(
      `${this.Baseurl}/property-cycles-summary`
    )
  }

  getTransactionsDashboard(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.Baseurl}/get-all-transactions`)
  }

  getTransactionsUser(userId: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${this.Baseurl}/get-all-transactions-user/${userId}`
    )
  }

  getWalletsDashboard(): Observable<Wallet[]> {
    return this.http.get<Wallet[]>(`${this.Baseurl}/get-all-wallets`)
  }

  getWalletSummary(): Observable<WalletSummary> {
    return this.http.get<WalletSummary>(`${this.Baseurl}/wallet-summary`)
  }

  getPropertiesProgress(): Observable<PropertyProgress[]> {
    return this.http.get<PropertyProgress[]>(
      `${this.Baseurl}/properties-progress`
    )
  }

  getInvestmentsAnalytics(
    period: string = 'month'
  ): Observable<InvestmentAnalytics> {
    return this.http.get<InvestmentAnalytics>(
      `${this.Baseurl}/investments-analytics?period=${period}`
    )
  }

  getPendingInvestments(): Observable<{
    totalPending: number
    data: PendingInvestment[]
  }> {
    return this.http.get<{ totalPending: number; data: PendingInvestment[] }>(
      `${this.Baseurl}/get-pending-investments`
    )
  }

  approveInvestment(investmentId: string): Observable<{ success: boolean }> {
    return this.http.put<{ success: boolean }>(
      `${this.Baseurl}/approve-investment/${investmentId}`,
      {}
    )
  }

  rejectInvestment(investmentId: string): Observable<{ success: boolean }> {
    return this.http.put<{ success: boolean }>(
      `${this.Baseurl}/reject-investment/${investmentId}`,
      {}
    )
  }

  getPropertiesCount(): Observable<CountResponse> {
    return this.http.get<CountResponse>(`${this.Baseurl}/properties-count`)
  }

  getCustomersCount(): Observable<CountResponse> {
    return this.http.get<CountResponse>(`${this.Baseurl}/customers-count`)
  }
}
