import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { LogoBoxComponent } from '@component/logo-box.component'

@Component({
  selector: 'app-lock-screen',
  standalone: true,
  imports: [RouterModule, LogoBoxComponent],
  templateUrl: './lock-screen.component.html',
  styles: ``,
})
export class LockScreenComponent {}
