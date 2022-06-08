import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetmaintenancegridComponent } from './assetmaintenancegrid.component';

describe('AssetmaintenancegridComponent', () => {
  let component: AssetmaintenancegridComponent;
  let fixture: ComponentFixture<AssetmaintenancegridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetmaintenancegridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetmaintenancegridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
