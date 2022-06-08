import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsubcategorymastergridComponent } from './assetsubcategorymastergrid.component';

describe('AssetsubcategorymastergridComponent', () => {
  let component: AssetsubcategorymastergridComponent;
  let fixture: ComponentFixture<AssetsubcategorymastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsubcategorymastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsubcategorymastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
