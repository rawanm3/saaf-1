import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { BannerComponent } from './components/banner/banner.component'
import { AgentDetailComponent } from './components/agent-detail/agent-detail.component'
import { ProfileCardComponent } from './components/profile-card/profile-card.component'
import { PropertyPhotosComponent } from './components/property-photos/property-photos.component'
import { LocationComponent } from './components/location/location.component'

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    PageTitleComponent,
    BannerComponent,
    AgentDetailComponent,
    ProfileCardComponent,
    PropertyPhotosComponent,
    LocationComponent,
  ],
  templateUrl: './details.component.html',
  styles: ``,
})
export class DetailsComponent {}
