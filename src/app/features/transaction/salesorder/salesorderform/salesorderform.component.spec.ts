import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesorderformComponent } from './salesorderform.component';

describe('SalesorderformComponent', () => {
  let component: SalesorderformComponent;
  let fixture: ComponentFixture<SalesorderformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesorderformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesorderformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
