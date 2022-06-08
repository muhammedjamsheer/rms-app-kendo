import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalcostdetailsformComponent } from './additionalcostdetailsform.component';

describe('AdditionalcostdetailsformComponent', () => {
  let component: AdditionalcostdetailsformComponent;
  let fixture: ComponentFixture<AdditionalcostdetailsformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalcostdetailsformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalcostdetailsformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
