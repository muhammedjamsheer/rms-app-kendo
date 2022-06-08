import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetfileuploadComponent } from './assetfileupload.component';

describe('AssetfileuploadComponent', () => {
  let component: AssetfileuploadComponent;
  let fixture: ComponentFixture<AssetfileuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetfileuploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetfileuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
