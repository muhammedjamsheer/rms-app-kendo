import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalcostdetailsgridComponent } from './additionalcostdetailsgrid.component';

describe('AdditionalcostdetailsgridComponent', () => {
  let component: AdditionalcostdetailsgridComponent;
  let fixture: ComponentFixture<AdditionalcostdetailsgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalcostdetailsgridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalcostdetailsgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
