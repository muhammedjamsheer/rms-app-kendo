import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetcategorymasterformComponent } from './assetcategorymasterform.component';

describe('AssetcategorymasterformComponent', () => {
  let component: AssetcategorymasterformComponent;
  let fixture: ComponentFixture<AssetcategorymasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetcategorymasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetcategorymasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
