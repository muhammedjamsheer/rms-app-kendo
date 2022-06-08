import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsummaryreportComponent } from './productsummaryreport.component';

describe('ProductsummaryreportComponent', () => {
  let component: ProductsummaryreportComponent;
  let fixture: ComponentFixture<ProductsummaryreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsummaryreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsummaryreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
