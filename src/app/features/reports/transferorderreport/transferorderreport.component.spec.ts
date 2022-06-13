import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferorderreportComponent } from './transferorderreport.component';

describe('TransferorderreportComponent', () => {
  let component: TransferorderreportComponent;
  let fixture: ComponentFixture<TransferorderreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferorderreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferorderreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
