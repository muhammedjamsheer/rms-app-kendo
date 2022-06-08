import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionordergridComponent } from './productionordergrid.component';

describe('ProductionordergridComponent', () => {
  let component: ProductionordergridComponent;
  let fixture: ComponentFixture<ProductionordergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionordergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionordergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
