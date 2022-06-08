import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandmodelmasterformComponent } from './brandmodelmasterform.component';

describe('BrandmodelmasterformComponent', () => {
  let component: BrandmodelmasterformComponent;
  let fixture: ComponentFixture<BrandmodelmasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandmodelmasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandmodelmasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
