import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseordergridComponent } from './purchaseordergrid.component';

describe('PurchaseordergridComponent', () => {
  let component: PurchaseordergridComponent;
  let fixture: ComponentFixture<PurchaseordergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseordergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseordergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
