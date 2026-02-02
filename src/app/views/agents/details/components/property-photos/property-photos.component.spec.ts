import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PropertyPhotosComponent } from './property-photos.component'

describe('PropertyPhotosComponent', () => {
  let component: PropertyPhotosComponent
  let fixture: ComponentFixture<PropertyPhotosComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyPhotosComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(PropertyPhotosComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
