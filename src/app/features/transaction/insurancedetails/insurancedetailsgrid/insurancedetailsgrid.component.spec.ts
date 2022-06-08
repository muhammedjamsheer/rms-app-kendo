import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancedetailsgridComponent } from './insurancedetailsgrid.component';

describe('InsurancedetailsgridComponent', () => {
  let component: InsurancedetailsgridComponent;
  let fixture: ComponentFixture<InsurancedetailsgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsurancedetailsgridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurancedetailsgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
