import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandmastergridComponent } from './brandmastergrid.component';

describe('BrandmastergridComponent', () => {
  let component: BrandmastergridComponent;
  let fixture: ComponentFixture<BrandmastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandmastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandmastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
