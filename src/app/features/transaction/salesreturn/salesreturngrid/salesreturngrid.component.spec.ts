import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesreturngridComponent } from './salesreturngrid.component';

describe('SalesreturngridComponent', () => {
  let component: SalesreturngridComponent;
  let fixture: ComponentFixture<SalesreturngridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesreturngridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesreturngridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
