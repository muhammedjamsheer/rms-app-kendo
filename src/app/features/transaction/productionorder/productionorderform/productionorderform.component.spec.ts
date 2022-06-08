import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionorderformComponent } from './productionorderform.component';

describe('ProductionorderformComponent', () => {
  let component: ProductionorderformComponent;
  let fixture: ComponentFixture<ProductionorderformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionorderformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionorderformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
