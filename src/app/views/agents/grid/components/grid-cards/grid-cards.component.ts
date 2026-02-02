import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import type { ChartOptions } from '@common/apexchart.model'
import {
  NgbDropdownModule,
  NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap'
import { NgApexchartsModule } from 'ng-apexcharts'

@Component({
  selector: 'grid-cards',
  standalone: true,
  imports: [NgApexchartsModule, NgbProgressbarModule, NgbDropdownModule],
  templateUrl: './grid-cards.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GridCardsComponent {
  gridChart: Partial<ChartOptions> = {
    chart: {
      height: 250,
      width:140,
      type: 'donut',
    },
    series: [80, 40, 30],
    legend: {
      show: false,
    },
    stroke: {
      width: 0,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: false,
            total: {
              showAlways: true,
              show: true,
            },
          },
        },
      },
    },
    labels: ['Vacant', 'Occupied', 'Unlisted'],
    colors: ['#027ef4', '#f0934e', '#47ad94'],
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  }

  sealPropertiesChart: Partial<ChartOptions> = {
    chart: {
      type: 'line',
      height: 115,
      sparkline: {
        enabled: true,
      },
    },
    series: [
      {
        data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54],
      },
    ],
    stroke: {
      width: 2,
      curve: 'smooth',
    },
    markers: {
      size: 0,
    },
    colors: ['#ffffff'],
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function () {
            return ''
          },
        },
      },
      marker: {
        show: false,
      },
    },
  }
}
