import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BalanceCardComponent } from './balance-card.component'

describe('BalanceCardComponent', () => {
  let component: BalanceCardComponent
  let fixture: ComponentFixture<BalanceCardComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceCardComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(BalanceCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
