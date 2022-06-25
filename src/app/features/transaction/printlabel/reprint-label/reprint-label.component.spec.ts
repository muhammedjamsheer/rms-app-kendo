import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReprintLabelComponent } from './reprint-label.component';

describe('ReprintLabelComponent', () => {
  let component: ReprintLabelComponent;
  let fixture: ComponentFixture<ReprintLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReprintLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReprintLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
