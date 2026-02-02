import { ComponentFixture, TestBed } from '@angular/core/testing'

import { Alt404Component } from './alt404.component'

describe('Alt404Component', () => {
  let component: Alt404Component
  let fixture: ComponentFixture<Alt404Component>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alt404Component],
    }).compileComponents()

    fixture = TestBed.createComponent(Alt404Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
