import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs'
import { AuthenticationService } from './auth.service'
import {
  CycleStats,
  Property,
  PropertyCycle,
  PropertyFilters,
  PropertyResponse,
  PropertyStats,
  UpdateDistributionDto,
} from '@core/models/property.model'
import { AddToMasterWalletResponse, GeneratePayoutPdfResponse, InvestorData,  InvestorDetailsResponse,  MasterWalletResponse, PropertyInvestorsResponse, PropertyPayoutResponse, TransferResponse } from '@core/models/wallet.model'
import { environment } from '@environment/environment.prod'

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  // private baseUrl = 'http://localhost:9000/api/realestate'
  // private cyclesUrl = 'http://localhost:9000/api/wallet'
    private baseUrl = `${environment.apiUrl}/realestate`
  private cyclesUrl = `${environment.apiUrl}/wallet`

  private propertiesSource = new BehaviorSubject<Property[]>([])
  private propertySource = new BehaviorSubject<Property | null>(null)
private cyclesSource = new BehaviorSubject<PropertyCycle[]>([])
private masterWalletSource = new BehaviorSubject<MasterWalletResponse | null>(null)
private investorsSource = new BehaviorSubject<InvestorData[]>([])
private investorDetailsSource = new BehaviorSubject<InvestorData | null>(null)
private payoutDetailsSource = new BehaviorSubject<PropertyPayoutResponse | null>(null)
private payoutPdfSource = new BehaviorSubject<string | null>(null)

payoutDetails$ = this.payoutDetailsSource.asObservable()
payoutPdf$ = this.payoutPdfSource.asObservable()
masterWallet$ = this.masterWalletSource.asObservable()
investors$ = this.investorsSource.asObservable()
investorDetails$ = this.investorDetailsSource.asObservable()
  properties$ = this.propertiesSource.asObservable()
  property$ = this.propertySource.asObservable()
  cycles$ = this.cyclesSource.asObservable()

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  private get headers() {
    return { Authorization: this.authService.session || '' }
  }

  getPendingDistributions() {
    return this.http.get(`${this.cyclesUrl}/pending-distributions`);
  }

  updatePendingDistribution(cycleId: string, investorId: string, action: 'approve' | 'reject') {
    return this.http.post(`${this.cyclesUrl}/update-pending-distributions/${cycleId}`, {
      investorId,
      action
    });
  }

  getStats(): Observable<PropertyStats> {
    return this.http.get<PropertyStats>(`${this.baseUrl}/stats`, {
      headers: this.headers,
    })
  }

  // getCyclesStats(): Observable<CycleStats> {
  //   return this.http.get<CycleStats>(`${this.cyclesUrl}/stats`, {
  //     headers: this.headers,
  //   })
  // }

  getAllRealEstates(): Observable<Property[]> {
    return this.http
      .get<{ properties: Property[] }>(`${this.baseUrl}/all-properties`, {
        headers: this.headers,
      })
      .pipe(
        map((res) => res.properties),
        tap((props) => this.propertiesSource.next(props)),
        catchError((err) => {
          console.error('Error fetching properties:', err)
          return of([])
        })
      )
  }

  getOneRealEstate(id: string): Observable<PropertyResponse> {
    return this.http
      .get<PropertyResponse>(`${this.baseUrl}/property/${id}`, {
        headers: this.headers,
      })
      .pipe(
        tap((res) => this.propertySource.next(res.property ?? res)),
        catchError((err) => {
          console.error('Error fetching property:', err)
          return throwError(() => err)
        })
      )
  }

  addProperty(formData: FormData): Observable<Property> {
    if (!this.authService.session) {
      return throwError(() => new Error('User is not authenticated!'))
    }

    return this.http
      .post<Property>(`${this.baseUrl}/add-property`, formData, {
        headers: this.headers,
      })
      .pipe(
        tap((newProp) => {
          const current = this.propertiesSource.value
          this.propertiesSource.next([newProp, ...current])
        })
      )
  }

  updateRealEstate(id: string, data: Partial<Property>): Observable<Property> {
    return this.http
      .put<Property>(`${this.baseUrl}/update-property/${id}`, data, {
        headers: this.headers,
      })
      .pipe(
        tap((updated) => {
          const updatedList = this.propertiesSource.value.map((p) =>
            p._id === updated._id ? updated : p
          )
          this.propertiesSource.next(updatedList)
          this.propertySource.next(updated)
        })
      )
  }

  updateRealEstateWithImages(
    id: string,
    formData: FormData
  ): Observable<Property> {
    return this.http
      .put<Property>(`${this.baseUrl}/update-property/${id}`, formData, {
        headers: this.headers,
      })
      .pipe(
        tap((updated) => {
          const updatedList = this.propertiesSource.value.map((p) =>
            p._id === updated._id ? updated : p
          )
          this.propertiesSource.next(updatedList)
          this.propertySource.next(updated)
        })
      )
  }

  deleteRealEstate(id: string): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${this.baseUrl}/delete-property/${id}`, {
        headers: this.headers,
      })
      .pipe(
        tap(() => {
          const filtered = this.propertiesSource.value.filter(
            (p) => p._id !== id
          )
          this.propertiesSource.next(filtered)
        })
      )
  }

  updateStatus(
    id: string,
    status: 'available' | 'pending' | 'sold'
  ): Observable<Property> {
    return this.http
      .put<Property>(
        `${this.baseUrl}/update-status/${id}`,
        { status },
        { headers: this.headers }
      )
      .pipe(
        tap((updated) => {
          const updatedList = this.propertiesSource.value.map((p) =>
            p._id === updated._id ? updated : p
          )
          this.propertiesSource.next(updatedList)
          this.propertySource.next(updated)
        })
      )
  }

  searchProperties(query: string): Observable<Property[]> {
    return this.http
      .get<Property[]>(`${this.baseUrl}/search?q=${query}`, {
        headers: this.headers,
      })
      .pipe(tap((res) => this.propertiesSource.next(res)))
  }

  getFilteredProperties(filters: PropertyFilters): Observable<Property[]> {
    let params = new HttpParams()
    if (filters.q) params = params.set('q', filters.q)
    if (filters.minPrice)
      params = params.set('minPrice', filters.minPrice.toString())
    if (filters.maxPrice)
      params = params.set('maxPrice', filters.maxPrice.toString())
    if (filters.type) params = params.set('type', filters.type)
    if (filters.features?.length)
      params = params.set('features', filters.features.join(','))

    return this.http
      .get<Property[]>(`${this.baseUrl}/filter`, {
        headers: this.headers,
        params,
      })
      .pipe(tap((res) => this.propertiesSource.next(res)))
  }

  // getPropertyCycles(propertyId: string): Observable<PropertyCycle[]> {
  //   return this.http
  //     .get<{ cycles?: PropertyCycle[] } | PropertyCycle[]>(
  //       `${this.cyclesUrl}/list/${propertyId}`,
  //       {
  //         headers: this.headers,
  //       }
  //     )
  //     .pipe(
  //       map((res) => (Array.isArray(res) ? res : res.cycles || [])),
  //       tap((cycles) => this.cyclesSource.next(cycles)),
  //       catchError((err) => {
  //         console.error('Error fetching property cycles:', err)
  //         return of([])
  //       })
  //     )
  // }

  // createPropertyCycle(data: Partial<PropertyCycle>): Observable<PropertyCycle> {
  //   return this.http
  //     .post<PropertyCycle>(`${this.cyclesUrl}/create`, data, {
  //       headers: this.headers,
  //     })
  //     .pipe(
  //       tap((newCycle) => {
  //         const current = this.cyclesSource.value
  //         this.cyclesSource.next([newCycle, ...current])
  //       })
  //     )
  // }

  // updatePropertyCycle(
  //   cycleId: string,
  //   data: Partial<PropertyCycle>
  // ): Observable<PropertyCycle> {
  //   return this.http
  //     .put<PropertyCycle>(`${this.cyclesUrl}/update/${cycleId}`, data, {
  //       headers: this.headers,
  //     })
  //     .pipe(
  //       tap((updated) => {
  //         const updatedList = this.cyclesSource.value.map((c) =>
  //           c._id === updated._id ? updated : c
  //         )
  //         this.cyclesSource.next(updatedList)
  //       })
  //     )
  // }

  // approvePropertyCycle(cycleId: string): Observable<PropertyCycle> {
  //   return this.http
  //     .post<PropertyCycle>(
  //       `${this.cyclesUrl}/approve/${cycleId}`,
  //       {},
  //       {
  //         headers: this.headers,
  //       }
  //     )
  //     .pipe(
  //       tap((approved) => {
  //         const updatedList = this.cyclesSource.value.map((c) =>
  //           c._id === approved._id ? approved : c
  //         )
  //         this.cyclesSource.next(updatedList)
  //       })
  //     )
  // }

  // rejectPropertyCycle(cycleId: string): Observable<PropertyCycle> {
  //   return this.http
  //     .post<PropertyCycle>(
  //       `${this.cyclesUrl}/reject/${cycleId}`,
  //       {},
  //       {
  //         headers: this.headers,
  //       }
  //     )
  //     .pipe(
  //       tap((rejected) => {
  //         const updatedList = this.cyclesSource.value.map((c) =>
  //           c._id === rejected._id ? rejected : c
  //         )
  //         this.cyclesSource.next(updatedList)
  //       })
  //     )
  // }

  // getPendingDistributions(): Observable<PropertyCycle[]> {
  //   return this.http.get<PropertyCycle[]>(
  //     `${this.cyclesUrl}/pending-distributions`,
  //     { headers: this.headers }
  //   )
  // }

  updatePendingDistributionsByUser(
    cycleId: string,
    data: UpdateDistributionDto[]
  ): Observable<PropertyCycle> {
    return this.http
      .post<PropertyCycle>(
        `${this.cyclesUrl}/update-pending-distributions/${cycleId}`,
        data,
        { headers: this.headers }
      )
      .pipe(
        tap((updated) => {
          const updatedList = this.cyclesSource.value.map((c) =>
            c._id === updated._id ? updated : c
          )
          this.cyclesSource.next(updatedList)
        })
      )
  }
  // getPropertyCycleById(cycleId: string): Observable<PropertyCycle> {
  //   return this.http.get<PropertyCycle>(`${this.cyclesUrl}/cycle/${cycleId}`, {
  //     headers: this.headers,
  //   })
  // }
addToMasterWallet(data: {
  propertyId: string
  amount: number
  totalexpense?: number
  notes?: string
}): Observable<AddToMasterWalletResponse> {
  return this.http
    .post<AddToMasterWalletResponse>(`${this.cyclesUrl}/master/add`, data, {
      headers: this.headers,
    })
    .pipe(
      tap((res) => {
        // optional: تحدثي الماستر واليت مباشرة
        const current = this.masterWalletSource.value
        if (current) {
          this.masterWalletSource.next({
            ...current,
            masterWallet: res.masterWallet,
            transactions: [res.transaction, ...current.transactions],
            total: current.total + 1,
          })
        }
      })
    )
}

getPropertyInvestors(propertyId: string): Observable<PropertyInvestorsResponse> {
  return this.http
    .get<PropertyInvestorsResponse>(
      `${this.cyclesUrl}/property/${propertyId}/investors`,
      { headers: this.headers }
    )
    .pipe(
      tap((res) => this.investorsSource.next(res.investors))
    )
}

getInvestorById(
  propertyId: string,
  investorId: string
): Observable<InvestorDetailsResponse> {
  return this.http
    .get<InvestorDetailsResponse>(
      `${this.cyclesUrl}/property/${propertyId}/investor/${investorId}`,
      { headers: this.headers }
    )
    .pipe(
      tap((res) => this.investorDetailsSource.next(res.investor))
    )
}

transferToInvestor(data: {
  investorId: string
  propertyId: string
  amount: number
  notes?: string
}): Observable<TransferResponse> {
  return this.http
    .post<TransferResponse>(`${this.cyclesUrl}/transfer`, data, {
      headers: this.headers,
    })
}

getMasterWallet(): Observable<MasterWalletResponse> {
  return this.http
    .get<MasterWalletResponse>(`${this.cyclesUrl}/master-wallet`, {
      headers: this.headers,
    })
    .pipe(
      tap((res) => this.masterWalletSource.next(res)),
      catchError((err) => {
        console.error('Error fetching master wallet:', err)
        return throwError(() => err)
      })
    )
}
getPropertyPayoutDetails(
  propertyId: string
): Observable<PropertyPayoutResponse> {
  return this.http
    .get<PropertyPayoutResponse>(
      `${this.baseUrl}/payout-details/${propertyId}`,
      { headers: this.headers }
    )
    .pipe(
      tap((res) => this.payoutDetailsSource.next(res)),
      catchError((err) => {
        console.error('Error fetching payout details:', err)
        return throwError(() => err)
      })
    )
}
generatePropertyPayoutPDF(
  propertyId: string
): Observable<GeneratePayoutPdfResponse> {
  return this.http
    .get<GeneratePayoutPdfResponse>(
      `${this.baseUrl}/payout-pdf/${propertyId}`,
      { headers: this.headers }
    )
    .pipe(
      tap((res) => {
        // نخزن رابط الـ PDF
        this.payoutPdfSource.next(res.file)
      }),
      catchError((err) => {
        console.error('Error generating payout PDF:', err)
        return throwError(() => err)
      })
    )
}
}
