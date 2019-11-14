import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPersonComponent } from './sales-person.component';

describe('SalesPersonComponent', () => {
  let component: SalesPersonComponent;
  let fixture: ComponentFixture<SalesPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesPersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
