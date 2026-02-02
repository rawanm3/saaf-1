import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { LogoBoxComponent } from '@component/logo-box.component'

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [LogoBoxComponent],
  templateUrl: './maintenance.component.html',
  styles: ``,
})
export class MaintenanceComponent {}
