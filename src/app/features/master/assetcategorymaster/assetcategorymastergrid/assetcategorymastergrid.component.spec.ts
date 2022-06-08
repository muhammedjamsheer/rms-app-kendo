import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetcategorymastergridComponent } from './assetcategorymastergrid.component';

describe('AssetcategorymastergridComponent', () => {
  let component: AssetcategorymastergridComponent;
  let fixture: ComponentFixture<AssetcategorymastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetcategorymastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetcategorymastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
