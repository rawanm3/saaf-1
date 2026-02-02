import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { LogoBoxComponent } from '@component/logo-box.component'

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, LogoBoxComponent],
  templateUrl: './signup.component.html',
  styles: ``,
})
export class SignupComponent {}
