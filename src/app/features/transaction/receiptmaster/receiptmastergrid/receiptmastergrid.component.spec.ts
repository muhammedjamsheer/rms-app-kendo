import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptmastergridComponent } from './receiptmastergrid.component';

describe('ReceiptmastergridComponent', () => {
  let component: ReceiptmastergridComponent;
  let fixture: ComponentFixture<ReceiptmastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptmastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptmastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
