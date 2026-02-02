import { ComponentFixture, TestBed } from '@angular/core/testing'

import { State2Component } from './state2.component'

describe('State2Component', () => {
  let component: State2Component
  let fixture: ComponentFixture<State2Component>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [State2Component],
    }).compileComponents()

    fixture = TestBed.createComponent(State2Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
