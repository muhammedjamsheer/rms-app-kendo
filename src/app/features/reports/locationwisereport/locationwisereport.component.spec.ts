import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationwisereportComponent } from './locationwisereport.component';

describe('LocationwisereportComponent', () => {
  let component: LocationwisereportComponent;
  let fixture: ComponentFixture<LocationwisereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationwisereportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationwisereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
