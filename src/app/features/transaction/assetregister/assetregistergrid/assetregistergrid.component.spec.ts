import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetregistergridComponent } from './assetregistergrid.component';

describe('AssetregistergridComponent', () => {
  let component: AssetregistergridComponent;
  let fixture: ComponentFixture<AssetregistergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetregistergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetregistergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
