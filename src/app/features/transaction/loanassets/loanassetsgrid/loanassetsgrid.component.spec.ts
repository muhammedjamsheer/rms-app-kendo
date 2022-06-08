import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanassetsgridComponent } from './loanassetsgrid.component';

describe('LoanassetsgridComponent', () => {
  let component: LoanassetsgridComponent;
  let fixture: ComponentFixture<LoanassetsgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanassetsgridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanassetsgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
