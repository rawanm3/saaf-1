import { ComponentFixture, TestBed } from '@angular/core/testing'

import { OwnPropertyComponent } from './own-property.component'

describe('OwnPropertyComponent', () => {
  let component: OwnPropertyComponent
  let fixture: ComponentFixture<OwnPropertyComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnPropertyComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(OwnPropertyComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
