import { Component } from '@angular/core'
import type { ChartOptions } from '@common/apexchart.model'
import { currency } from '@common/constants'
import { NgApexchartsModule } from 'ng-apexcharts'

@Component({
  selector: 'customer-own-property',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './own-property.component.html',
  styles: ``,
})
export class OwnPropertyComponent {
  currency = currency

  ownPropertyChart: Partial<ChartOptions> = {
    chart: {
      height: 360,
      type: 'radialBar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: '70%',
          background: 'transparent',
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24,
          },
        },
        track: {
          background: 'rgba(170,184,197, 0.4)',
          strokeWidth: '67%',
          margin: 0,
        },

        dataLabels: {
          name: {
            offsetY: -10,
            show: true,
            color: '#888',
            fontSize: '17px',
          },
          value: {
            color: '#111',
            fontSize: '36px',
            show: true,
            formatter: function (val: any) {
              return val
            },
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#7f56da', '#4697ce'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    series: [27],
    stroke: {
      lineCap: 'round',
    },
    labels: ['Own'],
  }
}
