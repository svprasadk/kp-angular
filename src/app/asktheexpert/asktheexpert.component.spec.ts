import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsktheexpertComponent } from './asktheexpert.component';

describe('AsktheexpertComponent', () => {
  let component: AsktheexpertComponent;
  let fixture: ComponentFixture<AsktheexpertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsktheexpertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsktheexpertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
