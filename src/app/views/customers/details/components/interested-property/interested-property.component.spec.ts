import { ComponentFixture, TestBed } from '@angular/core/testing'

import { InterestedPropertyComponent } from './interested-property.component'

describe('InterestedPropertyComponent', () => {
  let component: InterestedPropertyComponent
  let fixture: ComponentFixture<InterestedPropertyComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterestedPropertyComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(InterestedPropertyComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
