import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandmodelmastergridComponent } from './brandmodelmastergrid.component';

describe('BrandmodelmastergridComponent', () => {
  let component: BrandmodelmastergridComponent;
  let fixture: ComponentFixture<BrandmodelmastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandmodelmastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandmodelmastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
