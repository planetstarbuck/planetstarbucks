import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterHeadingComponent } from './chapter-heading.component';

describe('ChapterHeadingComponent', () => {
  let component: ChapterHeadingComponent;
  let fixture: ComponentFixture<ChapterHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChapterHeadingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChapterHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
