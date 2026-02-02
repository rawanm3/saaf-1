import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PropertyStateComponent } from './property-state.component'

describe('PropertyStateComponent', () => {
  let component: PropertyStateComponent
  let fixture: ComponentFixture<PropertyStateComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyStateComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(PropertyStateComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
