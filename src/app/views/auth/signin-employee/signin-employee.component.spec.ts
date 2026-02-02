import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninEmployeeComponent } from './signin-employee.component';

describe('SigninEmployeeComponent', () => {
  let component: SigninEmployeeComponent;
  let fixture: ComponentFixture<SigninEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigninEmployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SigninEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
