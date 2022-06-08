import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetdisposalformComponent } from './assetdisposalform.component';

describe('AssetdisposalformComponent', () => {
  let component: AssetdisposalformComponent;
  let fixture: ComponentFixture<AssetdisposalformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetdisposalformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetdisposalformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
