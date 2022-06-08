import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentgridComponent } from './shipmentgrid.component';

describe('ShipmentgridComponent', () => {
  let component: ShipmentgridComponent;
  let fixture: ComponentFixture<ShipmentgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipmentgridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
