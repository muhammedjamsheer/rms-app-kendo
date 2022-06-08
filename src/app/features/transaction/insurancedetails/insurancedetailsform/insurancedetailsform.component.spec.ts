import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancedetailsformComponent } from './insurancedetailsform.component';

describe('InsurancedetailsformComponent', () => {
  let component: InsurancedetailsformComponent;
  let fixture: ComponentFixture<InsurancedetailsformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsurancedetailsformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurancedetailsformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
