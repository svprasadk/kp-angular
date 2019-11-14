import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { feedbackComponent } from './feedback.component';

describe('feedbackComponent', () => {
  let component: feedbackComponent;
  let fixture: ComponentFixture<feedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ feedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(feedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
