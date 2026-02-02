import { Component, OnInit } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { InvestmentDataComponent } from './components/investment-data/investment-data.component'
import { InvestmentStateComponent } from './components/investment-state/investment-state.component'
import { investmentStatData } from './data'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'app-investment-list',
  standalone: true,
  imports: [
    PageTitleComponent,
    InvestmentStateComponent,
    InvestmentDataComponent,
    TranslateModule,
  ],
  templateUrl: './list.component.html',
  styles: ``,
})
export class InvestmentListComponent implements OnInit {
  stateList = investmentStatData

  ngOnInit(): void {}
}
