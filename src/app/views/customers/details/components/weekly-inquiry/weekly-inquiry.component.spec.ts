import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WeeklyInquiryComponent } from './weekly-inquiry.component'

describe('WeeklyInquiryComponent', () => {
  let component: WeeklyInquiryComponent
  let fixture: ComponentFixture<WeeklyInquiryComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyInquiryComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(WeeklyInquiryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
