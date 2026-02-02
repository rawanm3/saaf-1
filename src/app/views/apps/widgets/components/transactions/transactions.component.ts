import { Component } from '@angular/core'
import { TransactionsList } from '../../data'
import { SimplebarAngularModule } from 'simplebar-angular'
import { CommonModule } from '@angular/common'
import { currency } from '@common/constants'

@Component({
  selector: 'widgets-transactions',
  standalone: true,
  imports: [SimplebarAngularModule, CommonModule],
  templateUrl: './transactions.component.html',
  styles: ``,
})
export class TransactionsComponent {
  transactions = TransactionsList
  currency = currency
}
