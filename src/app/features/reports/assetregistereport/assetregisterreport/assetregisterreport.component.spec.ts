import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetregisterreportComponent } from './assetregisterreport.component';

describe('AssetregisterreportComponent', () => {
  let component: AssetregisterreportComponent;
  let fixture: ComponentFixture<AssetregisterreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetregisterreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetregisterreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
