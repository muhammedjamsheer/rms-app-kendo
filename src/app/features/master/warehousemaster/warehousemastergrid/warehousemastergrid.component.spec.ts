import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehousemastergridComponent } from './warehousemastergrid.component';

describe('WarehousemastergridComponent', () => {
  let component: WarehousemastergridComponent;
  let fixture: ComponentFixture<WarehousemastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehousemastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehousemastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
