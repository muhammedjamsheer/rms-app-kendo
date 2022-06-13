import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesreturnformComponent } from './salesreturnform.component';

describe('SalesreturnformComponent', () => {
  let component: SalesreturnformComponent;
  let fixture: ComponentFixture<SalesreturnformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesreturnformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesreturnformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
