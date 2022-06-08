import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeewisereportComponent } from './employeewisereport.component';

describe('EmployeewisereportComponent', () => {
  let component: EmployeewisereportComponent;
  let fixture: ComponentFixture<EmployeewisereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeewisereportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeewisereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
