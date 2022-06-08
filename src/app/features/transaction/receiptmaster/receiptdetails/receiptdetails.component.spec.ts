import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptdetailsComponent } from './receiptdetails.component';

describe('ReceiptdetailsComponent', () => {
  let component: ReceiptdetailsComponent;
  let fixture: ComponentFixture<ReceiptdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
