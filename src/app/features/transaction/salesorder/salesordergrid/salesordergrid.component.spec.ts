import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesordergridComponent } from './salesordergrid.component';

describe('SalesordergridComponent', () => {
  let component: SalesordergridComponent;
  let fixture: ComponentFixture<SalesordergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesordergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesordergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
