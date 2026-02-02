import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EmailViewComponent } from './email-view.component'

describe('EmailViewComponent', () => {
  let component: EmailViewComponent
  let fixture: ComponentFixture<EmailViewComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailViewComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(EmailViewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
