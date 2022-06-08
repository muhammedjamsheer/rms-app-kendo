import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptmasterformComponent } from './receiptmasterform.component';

describe('ReceiptmasterformComponent', () => {
  let component: ReceiptmasterformComponent;
  let fixture: ComponentFixture<ReceiptmasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptmasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptmasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
