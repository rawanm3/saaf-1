import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'customer-info',
  standalone: true,
  imports: [CommonModule, NgbCarouselModule, TranslateModule],
  templateUrl:'./customer-info.component.html',
  styles: ``,
})
export class CustomerInfoComponent {
  @Input() customer: any
  @Output() editRequested = new EventEmitter<void>()

  emitEdit() {
    this.editRequested.emit()
  }

  get showNationalId(): boolean {
    const country: string = (this.customer?.country || '').toString().trim().toLowerCase()
    const isSaudi = country === 'saudi arabia' || country === 'sa' || country === 'ksa'
    return !!this.customer?.nationalIdImageUrl && !isSaudi
  }
  hideImage(event: Event) {
  const element = event.target as HTMLImageElement;
  if (element) {
    element.style.display = 'none';
  }
}

}
