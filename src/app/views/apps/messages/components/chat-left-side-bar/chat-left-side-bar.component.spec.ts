import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ChatLeftSideBarComponent } from './chat-left-side-bar.component'

describe('ChatLeftSideBarComponent', () => {
  let component: ChatLeftSideBarComponent
  let fixture: ComponentFixture<ChatLeftSideBarComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatLeftSideBarComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ChatLeftSideBarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
