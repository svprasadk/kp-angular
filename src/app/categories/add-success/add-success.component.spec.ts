import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSuccessComponent } from './add-success.component';

describe('AddSuccessComponent', () => {
  let component: AddSuccessComponent;
  let fixture: ComponentFixture<AddSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
