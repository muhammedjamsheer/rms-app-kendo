import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseorderreturformComponent } from './purchaseorderreturform.component';

describe('PurchaseorderreturformComponent', () => {
  let component: PurchaseorderreturformComponent;
  let fixture: ComponentFixture<PurchaseorderreturformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseorderreturformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseorderreturformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
