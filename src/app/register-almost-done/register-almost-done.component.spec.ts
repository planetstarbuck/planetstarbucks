import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAlmostDoneComponent } from './register-almost-done.component';

describe('RegisterAlmostDoneComponent', () => {
  let component: RegisterAlmostDoneComponent;
  let fixture: ComponentFixture<RegisterAlmostDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterAlmostDoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterAlmostDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
