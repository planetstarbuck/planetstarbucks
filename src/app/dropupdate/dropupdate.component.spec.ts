import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropupdateComponent } from './dropupdate.component';

describe('DropupdateComponent', () => {
  let component: DropupdateComponent;
  let fixture: ComponentFixture<DropupdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropupdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
