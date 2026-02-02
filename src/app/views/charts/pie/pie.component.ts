import { Component } from '@angular/core'
import type { ChartOptions } from '@common/apexchart.model'
import { PageTitleComponent } from '@component/page-title.component'
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component'
import { NgApexchartsModule } from 'ng-apexcharts'

@Component({
  selector: 'app-pie',
  standalone: true,
  imports: [PageTitleComponent, UIExamplesListComponent, NgApexchartsModule],
  templateUrl: './pie.component.html',
  styles: ``,
})
export class PieComponent {
  pieChart: Partial<ChartOptions> = {
    chart: {
      height: 320,
      type: 'pie',
    },
    series: [44, 55, 41, 17, 15],
    labels: ['Series 1', 'Series 2', 'Series 3', 'Series 4', 'Series 5'],
    colors: ['#4697ce', '#7f56da', '#e06d94', '#f8ac59', '#7dcc93'],
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      floating: false,
      fontSize: '14px',
      offsetX: 0,
      offsetY: 7,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 240,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  }

  donutChart: Partial<ChartOptions> = {
    chart: {
      height: 320,
      type: 'donut',
    },
    series: [44, 55, 41, 17, 15],
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      floating: false,
      fontSize: '14px',
      offsetX: 0,
      offsetY: 7,
    },
    labels: ['Series 1', 'Series 2', 'Series 3', 'Series 4', 'Series 5'],
    colors: ['#7f56da', '#4697ce', '#e06d94', '#7dcc93', '#f8ac59'],
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 240,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  }

  monochromeChart: Partial<ChartOptions> = {
    chart: {
      height: 320,
      type: 'pie',
    },
    series: [25, 15, 44, 55, 41, 17],
    labels: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      floating: false,
      fontSize: '14px',
      offsetX: 0,
      offsetY: 7,
    },
    theme: {
      monochrome: {
        enabled: true,
      },
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 240,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  }

  gradientChart: Partial<ChartOptions> = {
    chart: {
      height: 320,
      type: 'donut',
    },
    series: [44, 55, 41, 17, 15],
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      floating: false,
      fontSize: '14px',
      offsetX: 0,
      offsetY: 7,
    },
    labels: ['Series 1', 'Series 2', 'Series 3', 'Series 4', 'Series 5'],
    colors: ['#7f56da', '#4697ce', '#e06d94', '#7dcc93', '#f8ac59'],
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 240,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
    fill: {
      type: 'gradient',
    },
  }

  patternedChart: Partial<ChartOptions> = {
    chart: {
      height: 320,
      type: 'donut',
      dropShadow: {
        enabled: true,
        color: '#111',
        top: -1,
        left: 3,
        blur: 3,
        opacity: 0.2,
      },
    },
    stroke: {
      show: true,
      width: 2,
    },
    series: [44, 55, 41, 17, 15],
    colors: ['#7f56da', '#4697ce', '#e06d94', '#7dcc93', '#f8ac59'],
    labels: ['Comedy', 'Action', 'SciFi', 'Drama', 'Horror'],
    dataLabels: {
      dropShadow: {
        blur: 3,
        opacity: 0.8,
      },
    },
    fill: {
      type: 'pattern',
      opacity: 1,
      pattern: {
        style: [
          'verticalLines',
          'squares',
          'horizontalLines',
          'circles',
          'slantedLines',
        ],
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      floating: false,
      fontSize: '14px',
      offsetX: 0,
      offsetY: 7,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 240,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  }

  imagePieChart: Partial<ChartOptions> = {
    chart: {
      height: 320,
      type: 'pie',
    },
    labels: ['Series 1', 'Series 2', 'Series 3', 'Series 4'],
    colors: ['#7f56da', '#1c84ee', '#ff6c2f', '#4ecac2', '#f9b931'],
    series: [44, 33, 54, 45],
    fill: {
      type: 'image',
      opacity: 0.85,
      image: {
        src: [
          'assets/images/small/img-1.jpg',
          'assets/images/small/img-2.jpg',
          'assets/images/small/img-3.jpg',
          'assets/images/small/img-4.jpg',
        ],
        width: 25,
      },
    },
    stroke: {
      width: 4,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      floating: false,
      fontSize: '14px',
      offsetX: 0,
      offsetY: 7,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 240,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  }

  updatedonutChart: Partial<ChartOptions> = {
    chart: {
      height: 320,
      type: 'donut',
    },
    dataLabels: {
      enabled: false,
    },
    series: [44, 55, 13, 33],
    colors: [
      '#4697ce',
      '#53389f',
      '#7f56da',
      '#ff86c8',
      '#e06d94',
      '#e06d94',
      '#f8ac59',
      '#7dcc93',
      '#040505',
      '#7dcc93',
    ],
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      floating: false,
      fontSize: '14px',
      offsetX: 0,
      offsetY: 7,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 240,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  }
}
