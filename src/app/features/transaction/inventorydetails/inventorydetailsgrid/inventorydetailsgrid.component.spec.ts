import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorydetailsgridComponent } from './inventorydetailsgrid.component';

describe('InventorydetailsgridComponent', () => {
  let component: InventorydetailsgridComponent;
  let fixture: ComponentFixture<InventorydetailsgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventorydetailsgridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorydetailsgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
