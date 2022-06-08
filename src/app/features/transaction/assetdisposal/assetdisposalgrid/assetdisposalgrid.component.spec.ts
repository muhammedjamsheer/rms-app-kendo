import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetdisposalgridComponent } from './assetdisposalgrid.component';

describe('AssetdisposalgridComponent', () => {
  let component: AssetdisposalgridComponent;
  let fixture: ComponentFixture<AssetdisposalgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetdisposalgridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetdisposalgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
