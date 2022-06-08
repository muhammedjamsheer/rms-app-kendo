import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssethistoryreportComponent } from './assethistoryreport.component';

describe('AssethistoryreportComponent', () => {
  let component: AssethistoryreportComponent;
  let fixture: ComponentFixture<AssethistoryreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssethistoryreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssethistoryreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
