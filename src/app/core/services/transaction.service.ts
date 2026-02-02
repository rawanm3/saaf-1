import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, catchError, of } from 'rxjs';
import { AuthenticationService } from './auth.service';
import { TransactionType } from '@views/apps/transactions/data';
import { environment } from '@environment/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private baseUrl = environment.apiUrl;
  private apiPrefix = '/dashboard';

  private transactionsSource = new BehaviorSubject<TransactionType[]>([]);
  transactions$ = this.transactionsSource.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  private get headers() {
    return { Authorization: this.authService.session || '' };
  }

  getAllTransactions(): Observable<TransactionType[]> {
    return this.http
      .get<any>(`${this.baseUrl}${this.apiPrefix}/get-all-transactions`, {
        headers: this.headers,
      })
      .pipe(
        map((res) => {
          return this.normalizeTransactionsResponse(res);
        }),
        catchError((error) => {
          return of([]);
        })
      );
  }

  getOneTransaction(id: string): Observable<TransactionType> {
    return this.http
      .get<any>(`${this.baseUrl}${this.apiPrefix}/transactions/${id}`, {
        headers: this.headers,
      })
      .pipe(
        map((res) => {
          return this.normalizeSingleTransactionResponse(res);
        }),
        catchError((error) => {
          return of(this.toTransaction(null));
        })
      );
  }

  setTransactions(transactions: TransactionType[]) {
    this.transactionsSource.next(transactions);
  }

  private normalizeTransactionsResponse(res: any): TransactionType[] {
    const list: any[] =
      res?.recentTransactions ?? res?.transactions ?? res?.data ?? res?.result ?? [];

    if (!Array.isArray(list)) return [];

    return list.map((it) => this.toTransaction(it)).filter(Boolean) as TransactionType[];
  }

  private normalizeSingleTransactionResponse(res: any): TransactionType {
    const obj = res?.transaction ?? res?.data ?? res;
    return this.toTransaction(obj);
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
      };
    }

    const userId = obj.userId ? obj.userId.toString() : obj.user?.id || '';
    const agentId = obj.processedBy ? obj.processedBy.toString().slice(-4) : '';
    const propertyId = obj.referenceId ? obj.referenceId.toString().slice(-4) : '';
    const walletId = obj.walletId ? obj.walletId.toString() : '';

    return {
      id: obj.id || obj._id || '',
      user: {
        name: obj.user?.name?.en || obj.user?.name?.ar || obj.user?.name || '',
        image: obj.user?.image || '',
      },
      purchaseDate: obj.createdAt
        ? new Date(obj.createdAt).toLocaleDateString('en-GB')
        : '',
      amount: obj.amount ?? 0,
      type: obj.type ?? '',
      status: obj.status ?? '',
      agentName: agentId ? `Agent ${agentId}` : '',
      investedProperty: propertyId ? `Property ${propertyId}` : '',
      walletId: walletId || '',
      userId,
    } as TransactionType;
  }
}
