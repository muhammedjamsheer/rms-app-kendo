import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetcountstatuswisereportComponent } from './assetcountstatuswisereport.component';

describe('AssetcountstatuswisereportComponent', () => {
  let component: AssetcountstatuswisereportComponent;
  let fixture: ComponentFixture<AssetcountstatuswisereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetcountstatuswisereportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetcountstatuswisereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
