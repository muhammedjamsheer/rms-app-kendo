import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantydetailsformComponent } from './warrantydetailsform.component';

describe('WarrantydetailsformComponent', () => {
  let component: WarrantydetailsformComponent;
  let fixture: ComponentFixture<WarrantydetailsformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarrantydetailsformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantydetailsformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
