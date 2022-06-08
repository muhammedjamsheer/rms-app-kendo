import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetmaintenanceformComponent } from './assetmaintenanceform.component';

describe('AssetmaintenanceformComponent', () => {
  let component: AssetmaintenanceformComponent;
  let fixture: ComponentFixture<AssetmaintenanceformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetmaintenanceformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetmaintenanceformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
