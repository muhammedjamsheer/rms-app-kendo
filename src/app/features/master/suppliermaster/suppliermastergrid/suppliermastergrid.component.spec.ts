import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliermastergridComponent } from './suppliermastergrid.component';

describe('SuppliermastergridComponent', () => {
  let component: SuppliermastergridComponent;
  let fixture: ComponentFixture<SuppliermastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuppliermastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppliermastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
