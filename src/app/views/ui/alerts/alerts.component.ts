import { Component } from '@angular/core'
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component'
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap'
import { alert, type AlertType } from './data'
import { PageTitleComponent } from '@component/page-title.component'

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [PageTitleComponent, NgbAlertModule, UIExamplesListComponent],
  templateUrl: './alerts.component.html',
  styles: ``,
})
export class AlertsComponent {
  alertData: AlertType[] = alert

  close(index: number) {
    this.alertData.splice(index, 1)
  }
}
