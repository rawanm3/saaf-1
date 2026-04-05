import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, map, Observable, catchError, of } from 'rxjs'
import { AuthenticationService } from './auth.service'
import { TransactionType } from '@views/apps/transactions/data'
import { environment } from '@environment/environment'
// import { environment } from '@environment/environment.prod'

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private baseUrl = environment.apiUrl
  private apiPrefix = '/dashboard'
  private walletPrefix = '/wallet'

  private transactionsSource = new BehaviorSubject<TransactionType[]>([])
  transactions$ = this.transactionsSource.asObservable()

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  private get headers() {
    return { Authorization: this.authService.session || '' }
  }

  generateTransactionsPDF(startDate?: string, endDate?: string): Observable<string> {
    let params: any = {}

    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate

    return this.http
      .get<any>(`${this.baseUrl}${this.apiPrefix}/generate-transactions-pdf`, {
        headers: this.headers,
        params,
      })
      .pipe(
        map((res) => res?.file || ''),
        catchError((err) => {
          console.error('PDF Error:', err)
          return of('')
        })
      )
  }

  // ✅ عرض ملف PDF مباشرة في المتصفح
  viewPDF(filename: string): Observable<Blob> {
    return this.http
      .get(`${this.baseUrl}${this.apiPrefix}/view-pdf/${filename}`, {
        headers: this.headers,
        responseType: 'blob',
      })
      .pipe(
        catchError((err) => {
          console.error('View PDF Error:', err)
          return of(new Blob())
        })
      )
  }

  // ✅ تحميل ملف PDF
  downloadPDF(filename: string): Observable<Blob> {
    return this.http
      .get(`${this.baseUrl}${this.apiPrefix}/view-pdf/${filename}`, {
        headers: this.headers,
        responseType: 'blob',
      })
      .pipe(
        catchError((err) => {
          console.error('Download PDF Error:', err)
          return of(new Blob())
        })
      )
  }

  // ✅ فتح PDF في تبويب جديد (طريقة بديلة)
  openPDFInNewTab(filename: string): void {
    const pdfUrl = `${this.baseUrl}${this.apiPrefix}/view-pdf/${filename}`;
    window.open(pdfUrl, '_blank');
  }

  // ✅ تحميل PDF باسم مخصص
  downloadPDFWithCustomName(filename: string, customName?: string): void {
    this.downloadPDF(filename).subscribe((blob: Blob) => {
      if (blob.size > 0) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = customName ? `${customName}.pdf` : filename;
        link.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }

  // ─── كل التراكنشنز ───
  // ─── كل التراكنشنز بكل حقولها ───
  getAllTransactions(): Observable<TransactionType[]> {
    return this.http
      .get<any>(`${this.baseUrl}${this.apiPrefix}/get-all-transactions`, {
        headers: this.headers,
      })
      .pipe(
        map((res) => {
          const list: any[] =
            res?.recentTransactions ?? res?.transactions ?? res?.data ?? []
          console.log('🔍 FIRST RAW:', JSON.stringify(list[0]))
          return list.map((t) => this.toTransaction(t)).filter(Boolean) as TransactionType[]
        }),
        catchError(() => of([]))
      )
  }

  // ─── Master Wallet info (الرصيد بس) ───
  getMasterWalletTransactions(): Observable<{
    masterWallet: any
    transactions: TransactionType[]
    total: number
  }> {
    return this.http
      .get<any>(`${this.baseUrl}${this.walletPrefix}/master-wallet`, {
        headers: this.headers,
      })
      .pipe(
        map((res) => ({
          masterWallet: res?.masterWallet ?? null,
          transactions: (res?.transactions ?? [])
            .map((it: any) => this.toTransaction(it))
            .filter(Boolean) as TransactionType[],
          total: res?.total ?? 0,
        })),
        catchError(() => of({ masterWallet: null, transactions: [], total: 0 }))
      )
  }

  getOneTransaction(id: string): Observable<TransactionType> {
    return this.http
      .get<any>(`${this.baseUrl}${this.apiPrefix}/transactions/${id}`, {
        headers: this.headers,
      })
      .pipe(
        map((res) => this.normalizeSingleTransactionResponse(res)),
        catchError(() => of(this.toTransaction(null)))
      )
  }

  setTransactions(transactions: TransactionType[]) {
    this.transactionsSource.next(transactions)
  }

  private normalizeTransactionsResponse(res: any): TransactionType[] {
    const list: any[] =
      res?.recentTransactions ?? res?.transactions ?? res?.data ?? res?.result ?? []

    if (!Array.isArray(list)) return []

    return list.map((it) => this.toTransaction(it)).filter(Boolean) as TransactionType[]
  }

  private normalizeSingleTransactionResponse(res: any): TransactionType {
    const obj = res?.transaction ?? res?.data ?? res
    return this.toTransaction(obj)
  }

  private toTransaction(obj: any): TransactionType {
    if (!obj) {
      return {
        id: '',
        user: { name: '', image: '' },
        purchaseDate: '',
        amount: 0,
        type: '',
        status: '',
        agentName: '',
        investedProperty: '',
        walletId: '',
        userId: '',
        currency: 'SAR',
        balanceBefore: 0,
        balanceAfter: 0,
        notes: '',
        processedBy: '',
        shares: 0,
        referenceModel: '',
      }
    }

    const userId = obj.userId
      ? typeof obj.userId === 'object'
        ? obj.userId._id || obj.userId.id || obj.userId.toString()
        : obj.userId.toString()
      : obj.user?.id || ''

    const userName =
      typeof obj.userId === 'object'
        ? obj.userId?.name || ''
        : obj.user?.name?.en || obj.user?.name?.ar || obj.user?.name || ''

    const userImage =
      typeof obj.userId === 'object' ? obj.userId?.image || '' : obj.user?.image || ''

    const processedBy =
      typeof obj.processedBy === 'object'
        ? obj.processedBy?.name || `Agent ${obj.processedBy?._id?.toString().slice(-4)}`
        : obj.processedBy
        ? `Agent ${obj.processedBy.toString().slice(-4)}`
        : ''

    const propertyId = obj.referenceId
      ? typeof obj.referenceId === 'object'
        ? obj.referenceId._id || obj.referenceId.toString()
        : obj.referenceId.toString()
      : ''

    const walletId = obj.walletId
      ? typeof obj.walletId === 'object'
        ? obj.walletId._id || obj.walletId.id || obj.walletId.toString()
        : obj.walletId.toString()
      : ''

    console.log('🔍 toTransaction:', {
      id: obj._id || obj.id,
      type: obj.type,
      rawBalanceBefore: obj.balanceBefore,
      rawBalanceAfter: obj.balanceAfter,
    })

    return {
      id: obj.id || obj._id || '',
      user: {
        name: userName,
        image: userImage,
      },
      purchaseDate: obj.createdAt
        ? new Date(obj.createdAt).toLocaleDateString('en-GB')
        : '',
      amount: obj.amount ?? 0,
      type: obj.type ?? '',
      status: obj.status ?? '',
      agentName: processedBy,
      investedProperty: propertyId ? `Property ${propertyId.slice(-4)}` : '',
      walletId,
      userId,
      currency: obj.currency ?? 'SAR',
      balanceBefore: obj.balanceBefore ?? 0,
      balanceAfter: obj.balanceAfter ?? 0,
      notes: obj.notes ?? '',
      processedBy,
      shares: obj.shares ?? 0,
      referenceModel: obj.referenceModel ?? '',
    } as TransactionType
  }
}
