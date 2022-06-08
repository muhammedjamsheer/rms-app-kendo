import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardformComponent } from './dashboardform.component';

describe('DashboardformComponent', () => {
  let component: DashboardformComponent;
  let fixture: ComponentFixture<DashboardformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
