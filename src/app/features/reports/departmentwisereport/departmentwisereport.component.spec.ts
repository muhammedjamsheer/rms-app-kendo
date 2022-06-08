import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentwisereportComponent } from './departmentwisereport.component';

describe('DepartmentwisereportComponent', () => {
  let component: DepartmentwisereportComponent;
  let fixture: ComponentFixture<DepartmentwisereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentwisereportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentwisereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
