import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core'
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap'
// import { CustomerService } from '@core/services/customer.service'
import { CustomersService } from '@core/services/customers.service'

@Component({
  selector: 'customer-property-card',
  standalone: true,
  imports: [NgbProgressbarModule],
  templateUrl: './property-card.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PropertyCardComponent implements OnInit {
  property: any[] = []

  constructor(private customerService: CustomersService) {}

  ngOnInit(): void {
    this.customerService.getPropertyStats().subscribe((stats) => {
      this.property = [
        {
          title: 'Active Properties',
          Property: stats.availableProperties,
          count: stats.totalProperties,
          progress: stats.availableProperties && stats.totalProperties ? Math.round((stats.availableProperties / Math.max(stats.totalProperties, 1)) * 100) : 0,
          icon: 'solar:home-2-bold',
          variant: 'primary'
        },
        {
          title: 'Property Active',
          Property: stats.availableProperties,
          count: stats.availableProperties,
          progress: 100,
          icon: 'solar:home-angle-bold',
          variant: 'success'
        },
        {
          title: 'Own Property',
          Property: stats.soldProperties,
          count: stats.soldProperties,
          progress: stats.totalProperties ? Math.round((stats.soldProperties / stats.totalProperties) * 100) : 0,
          icon: 'solar:buildings-3-bold',
          variant: 'warning'
        }
      ]
    })
  }
}
