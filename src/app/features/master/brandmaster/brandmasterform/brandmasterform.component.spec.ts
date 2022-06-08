import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandmasterformComponent } from './brandmasterform.component';

describe('BrandmasterformComponent', () => {
  let component: BrandmasterformComponent;
  let fixture: ComponentFixture<BrandmasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandmasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandmasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
