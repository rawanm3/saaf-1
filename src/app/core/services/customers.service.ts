import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs'
import { AuthenticationService } from './auth.service'
import { environment } from '@environment/environment.prod'

import {
  CustomerType,
  WalletResponse,
  InvestmentsResponse,
  TransactionsResponse,
  UserResponse,
  Investment,
  UsersResponse,
  CustomerFiles,
  CustomerData,
  CustomerPayload,
  Wallet,
  Transaction,
  Customer,
  CustomerStatsResponse,
  SingleCustomerResponse,
  CustomersResponse,
} from '../models/customer.model'

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private baseUrl = environment.apiUrl
  private customersSource = new BehaviorSubject<CustomerType[]>([])
  customers$ = this.customersSource.asObservable()

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  getAllCustomers(): Observable<CustomerType[]> {
    return this.http
      .get<CustomersResponse | CustomerType[]>(`${this.baseUrl}/user/users`)
      .pipe(map((res) => this.normalizeCustomersResponse(res)))
  }

  getOneCustomer(id: string): Observable<CustomerType> {
    return this.http
      .get<SingleCustomerResponse | CustomerType>(
        `${this.baseUrl}/user/user/${id}`
      )
      .pipe(map((res) => this.normalizeSingleCustomerResponse(res)))
  }

  getCustomerById(id: string): Observable<Customer | null> {
    return this.http
      .get<UserResponse | Customer>(`${this.baseUrl}/user/user/${id}`)
      .pipe(
        map((res) => {
          const u = (res as UserResponse).user ?? (res as Customer)
          return this.normalizeName(u)
        }),
        catchError(() => of(null))
      )
  }

  getCustomerStats(): Observable<{
    users: number
    pendingUsers: number
    rejectedUsers: number
    investors: number
    buyers: number
  }> {
    return this.http
      .get<{
        users: number
        pendingUsers: number
        rejectedUsers: number
        investors: number
        buyers: number
      }>(`${this.baseUrl}/register/stats`)
      .pipe(
        map((res) => ({
          users: Number(res.users) || 0,
          pendingUsers: Number(res.pendingUsers) || 0,
          rejectedUsers: Number(res.rejectedUsers) || 0,
          investors: Number(res.investors) || 0,
          buyers: Number(res.buyers) || 0,
        })),
        catchError(() =>
          of({
            users: 0,
            pendingUsers: 0,
            rejectedUsers: 0,
            investors: 0,
            buyers: 0,
          })
        )
      )
  }

  updateCustomer(
    id: string,
    data: Partial<CustomerType>
  ): Observable<CustomerType> {
    return this.http.put<CustomerType>(
      `${this.baseUrl}/user/update-user/${id}`,
      data
    )
  }

  updateOneCustomer(
    id: string,
    data: Partial<CustomerType>
  ): Observable<Customer> {
    return this.http
      .put<Customer>(`${this.baseUrl}/user/update-user/${id}`, data)
      .pipe(
        map((res) => ({
          ...res,
          _id: res._id ?? res.id ?? '',
          fullName: res.fullName || res.name || '',
        }))
      )
  }

confirmUser(id: string, status: string) {
  return this.http.put(`${this.baseUrl}/register/confirm-user/${id}`, { status });
}

  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/user/delete-user/${id}`)
  }

  updateStatus(id: string, status: string): Observable<CustomerType> {
    return this.http.put<CustomerType>(
      `${this.baseUrl}/user/update-status/${id}`,
      { status }
    )
  }

  private normalizeCustomersResponse(
    res: CustomersResponse | CustomerType[]
  ): CustomerType[] {
    const list: CustomerType[] = Array.isArray(res)
      ? res
      : res.customers ?? res.users ?? res.data ?? res.result ?? []

    if (!Array.isArray(list)) return []
    return list.map((it) => this.toCustomer(it))
  }

  private normalizeSingleCustomerResponse(
    res: SingleCustomerResponse | CustomerType
  ): CustomerType {
    const obj =
      (res as SingleCustomerResponse).customer ??
      (res as SingleCustomerResponse).user ??
      (res as SingleCustomerResponse).data ??
      (res as CustomerType)
    return this.toCustomer(obj)
  }

  private toCustomer(obj: CustomerType | null | undefined): CustomerType {
    if (!obj) {
      return {
        id: '',
        name: '',
        image: '',
        email: '',
        phone: '',
        country: '',
        role: '',
        type: '',
        address: '',
        customerStatus: '',
        date: '',
        status: '',
        propertyView: 0,
        propertyOwn: 0,
        invest: '',
      }
    }
    const id = obj.id ?? obj._id ?? ''
    return {
      id: String(id),
      name: obj.name ?? obj.fullName ?? obj.username ?? '',
      // image: obj.image ?? obj.avatar ?? '',
      image: obj.image ?? obj.avatar ?? obj.profileImage ?? obj.profileImageUrl ?? '',
      email: obj.email ?? '',
      phone: obj.phone ?? obj.mobile ?? '',
      country: obj.country ?? '',
      type: obj.type ?? obj.customerType ?? '',
      address: obj.address ?? '',
      role: obj.role ?? '',
      customerStatus: obj.customerStatus ?? obj.statusText ?? obj.status ?? '',
      date: obj.date ?? obj.createdAt ?? obj.updatedAt ?? '',
      status: obj.status ?? '',
      propertyView: obj.propertyView ?? 0,
      propertyOwn: obj.propertyOwn ?? 0,
      invest: obj.invest ?? obj.investment ?? '',
    }
  }

  private normalizeName(user: Customer): Customer {
    if (!user) return user
    return {
      ...user,
      fullName: user.fullName || user.name || user.nameEN || '',
    }
  }

  searchUsers(query: string): Observable<Customer[]> {
    const q = encodeURIComponent(query)
    return this.http
      .get<UsersResponse | Customer[]>(`${this.baseUrl}/user/users?search=${q}`)
      .pipe(
        map((res) => {
          const users: Customer[] = Array.isArray(res) ? res : res.users ?? []
          return users.map((u) => this.normalizeName(u))
        }),
        catchError(() => of([]))
      )
  }

  getUserTransactions(userId: string): Observable<Transaction[]> {
    if (!userId) return of([])
    return this.http
      .get<TransactionsResponse | Transaction[]>(
        `${this.baseUrl}/dashboard/get-all-transactions-user/${userId}`
      )
      .pipe(
        map((response) => {
          if (Array.isArray(response)) return response
          if (response.transactions) return response.transactions
          if (response.data) return response.data
          return []
        }),
        catchError(() => of([]))
      )
  }

  getWalletByUserId(userId: string): Observable<Wallet | null> {
    if (!userId) return of(null)
    return this.http
      .get<WalletResponse>(`${this.baseUrl}/wallet/my-wallet`, {
        params: { userId },
      })
      .pipe(
        map((res) => res.wallet ?? null),
        catchError(() => of(null))
      )
  }

  getInvestmentsByUserId(userId: string): Observable<Investment[]> {
    if (!userId) return of([])
    return this.http
      .get<InvestmentsResponse>(`${this.baseUrl}/investment/my-investments`, {
        params: { investorId: userId },
      })
      .pipe(
        map((res) => res.data ?? []),
        catchError(() => of([]))
      )
  }

  refreshCustomers(): void {
    this.getAllCustomers().subscribe()
  }

  isAuthenticated(): boolean {
    return !!this.authService.session
  }

  addCustomer(
    customerData: CustomerPayload,
    files: CustomerFiles
  ): Observable<HttpResponse<unknown>> {
    const formData = new FormData()

    for (const key in customerData) {
      const value = customerData[key as keyof CustomerPayload]
      if (value !== undefined && value !== null && value !== '') {
        const isFile = (val: any): val is File | Blob =>
          val instanceof Blob || val instanceof File

        formData.append(key, isFile(value) ? value : String(value))
      }
    }
    if (customerData.status) {
      formData.append('customerStatus', customerData.status)
    }

    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file)
      }
    })

    return this.http.post<unknown>(`${this.baseUrl}/register/add`, formData, {
      observe: 'response',
    })
  }
}