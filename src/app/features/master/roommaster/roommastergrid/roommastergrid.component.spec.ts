import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoommastergridComponent } from './roommastergrid.component';

describe('RoommastergridComponent', () => {
  let component: RoommastergridComponent;
  let fixture: ComponentFixture<RoommastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoommastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoommastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
