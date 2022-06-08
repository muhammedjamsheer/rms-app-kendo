import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomermastergridComponent } from './customermastergrid.component';

describe('CustomermastergridComponent', () => {
  let component: CustomermastergridComponent;
  let fixture: ComponentFixture<CustomermastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomermastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomermastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
