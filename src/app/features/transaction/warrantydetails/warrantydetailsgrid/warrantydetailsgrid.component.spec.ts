import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantydetailsgridComponent } from './warrantydetailsgrid.component';

describe('WarrantydetailsgridComponent', () => {
  let component: WarrantydetailsgridComponent;
  let fixture: ComponentFixture<WarrantydetailsgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarrantydetailsgridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantydetailsgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
