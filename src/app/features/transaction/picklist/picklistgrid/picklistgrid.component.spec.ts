import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PicklistgridComponent } from './picklistgrid.component';

describe('PicklistgridComponent', () => {
  let component: PicklistgridComponent;
  let fixture: ComponentFixture<PicklistgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PicklistgridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PicklistgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
