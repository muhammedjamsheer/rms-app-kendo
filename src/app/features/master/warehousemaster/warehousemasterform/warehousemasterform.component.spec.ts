import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehousemasterformComponent } from './warehousemasterform.component';

describe('WarehousemasterformComponent', () => {
  let component: WarehousemasterformComponent;
  let fixture: ComponentFixture<WarehousemasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehousemasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehousemasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
