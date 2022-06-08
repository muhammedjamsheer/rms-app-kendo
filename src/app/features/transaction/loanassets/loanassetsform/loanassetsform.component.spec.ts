import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanassetsformComponent } from './loanassetsform.component';

describe('LoanassetsformComponent', () => {
  let component: LoanassetsformComponent;
  let fixture: ComponentFixture<LoanassetsformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanassetsformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanassetsformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
