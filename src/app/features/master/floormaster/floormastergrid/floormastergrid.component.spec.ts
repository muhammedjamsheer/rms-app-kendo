import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloormastergridComponent } from './floormastergrid.component';

describe('FloormastergridComponent', () => {
  let component: FloormastergridComponent;
  let fixture: ComponentFixture<FloormastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloormastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloormastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
