import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'app-logo-box',
  standalone: true,
  imports: [RouterLink, CommonModule,TranslateModule],
  template: `
    <div [class]="className">
      <a routerLink="/" class="logo-dark">
        @if (size) {
          <img src="assets/images/logo-light.png" class="logo-sm" alt="logo sm" />
          <img
            src="assets/images/logo-light.png"
            class="logo-lg"
            alt="logo dark"
          />
        } @else {
          <img src="assets/images/logo-light.png" class="rounded" height="55" alt="logo dark" />
          
        }
      </a>

      <a routerLink="/" class="logo-light">
        @if (size) {
          <img src="assets/images/logo-light.png" class="logo-sm" alt="logo sm" />
          <img
            src="assets/images/logo-light.png"
            class="logo-lg"
            alt="logo light"
          />
          <span>{{ 'REAL_ESTATE.SAAF' | translate }}</span>
        } @else {
          <img
            src="assets/images/logo-light.png"
            height="32"
            alt="logo light"
          />
        }
        
      </a>

    </div>
  `,
})
export class LogoBoxComponent {
  @Input() className: string = ''
  @Input() size: boolean = false
}
