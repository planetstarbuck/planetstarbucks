import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCheckMailComponent } from './register-check-mail.component';

describe('RegisterCheckMailComponent', () => {
  let component: RegisterCheckMailComponent;
  let fixture: ComponentFixture<RegisterCheckMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterCheckMailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterCheckMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
