import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { propertyFileData, propertyStatusData, reviewData } from '../../data'
import type { ChartOptions } from '@common/apexchart.model'
import { NgApexchartsModule } from 'ng-apexcharts'
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'agent-detail',
  standalone: true,
  imports: [NgApexchartsModule, NgbRatingModule],
  templateUrl: './agent-detail.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AgentDetailComponent {
  propertyStatusData = propertyStatusData
  reviewData = reviewData
  propertyFiles = propertyFileData

  statusChart: Partial<ChartOptions> = {
    chart: {
      width: 90,
      height: 90,
      type: 'radialBar',
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: '50%',
        },
        track: {
          margin: 0,
        },
        dataLabels: {
          show: false,
        },
      },
    },
    grid: {
      padding: {
        top: -15,
        bottom: -15,
      },
    },
    stroke: {
      lineCap: 'round',
    },
    labels: ['Cricket'],
  }
}
