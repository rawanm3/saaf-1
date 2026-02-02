import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { LogoBoxComponent } from '@component/logo-box.component'

@Component({
  selector: 'app-error404',
  standalone: true,
  imports: [RouterLink, LogoBoxComponent],
  templateUrl: './error404.component.html',
  styles: ``,
})
export class Error404Component {}
