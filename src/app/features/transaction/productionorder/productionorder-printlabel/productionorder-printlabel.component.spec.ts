import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionorderPrintlabelComponent } from './productionorder-printlabel.component';

describe('ProductionorderPrintlabelComponent', () => {
  let component: ProductionorderPrintlabelComponent;
  let fixture: ComponentFixture<ProductionorderPrintlabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionorderPrintlabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionorderPrintlabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
