import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferrquestformComponent } from './transferrquestform.component';

describe('TransferrquestformComponent', () => {
  let component: TransferrquestformComponent;
  let fixture: ComponentFixture<TransferrquestformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferrquestformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferrquestformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
