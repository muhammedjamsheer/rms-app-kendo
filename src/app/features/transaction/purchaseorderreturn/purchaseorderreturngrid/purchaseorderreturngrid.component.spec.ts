import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseorderreturngridComponent } from './purchaseorderreturngrid.component';

describe('PurchaseorderreturngridComponent', () => {
  let component: PurchaseorderreturngridComponent;
  let fixture: ComponentFixture<PurchaseorderreturngridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseorderreturngridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseorderreturngridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
