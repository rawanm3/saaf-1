import { Component } from '@angular/core'
import type { ChartOptions } from '@common/apexchart.model'
import { currentYear } from '@common/constants'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { NgApexchartsModule } from 'ng-apexcharts'

@Component({
  selector: 'customer-weekly-inquiry',
  standalone: true,
  imports: [NgApexchartsModule, NgbDropdownModule],
  templateUrl: './weekly-inquiry.component.html',
  styles: ``,
})
export class WeeklyInquiryComponent {
  currentYear = currentYear
  weeklyInquiryChart: Partial<ChartOptions> = {
    chart: {
      height: 294,
      parentHeightOffset: 0,
      type: 'bar',
      toolbar: {
        show: !1,
      },
    },
    plotOptions: {
      bar: {
        barHeight: '100%',
        columnWidth: '40%',
        borderRadius: 4,
        distributed: !0,
      },
    },
    grid: {
      show: !1,
      padding: {
        top: -20,
        bottom: -10,
        left: 0,
        right: 0,
      },
    },
    colors: ['#604ae3', '#d3cbff', '#d3cbff', '#d3cbff'],
    dataLabels: {
      enabled: true,
    },
    series: [
      {
        name: 'Inquiry',
        data: [4, 5, 6, 4, 9, 5, 4],
      },
    ],
    legend: {
      show: !1,
    },
    xaxis: {
      categories: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      axisBorder: {
        show: !1,
      },
      axisTicks: {
        show: !1,
      },
    },
    yaxis: {
      labels: {
        show: !1,
      },
    },
    tooltip: {
      enabled: !0,
    },
    responsive: [
      {
        breakpoint: 1025,
        options: {
          chart: {
            height: 199,
          },
        },
      },
    ],
  }
}
