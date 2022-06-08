import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliermasterformComponent } from './suppliermasterform.component';

describe('SuppliermasterformComponent', () => {
  let component: SuppliermasterformComponent;
  let fixture: ComponentFixture<SuppliermasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuppliermasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppliermasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
