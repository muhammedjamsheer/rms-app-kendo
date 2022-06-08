import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetregisterformComponent } from './assetregisterform.component';

describe('AssetregisterformComponent', () => {
  let component: AssetregisterformComponent;
  let fixture: ComponentFixture<AssetregisterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetregisterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetregisterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
