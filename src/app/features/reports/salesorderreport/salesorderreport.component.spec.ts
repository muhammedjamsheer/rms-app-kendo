import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesorderreportComponent } from './salesorderreport.component';

describe('SalesorderreportComponent', () => {
  let component: SalesorderreportComponent;
  let fixture: ComponentFixture<SalesorderreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesorderreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesorderreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
