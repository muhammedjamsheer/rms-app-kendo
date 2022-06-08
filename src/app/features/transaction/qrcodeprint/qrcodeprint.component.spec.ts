import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeprintComponent } from './qrcodeprint.component';

describe('QrcodeprintComponent', () => {
  let component: QrcodeprintComponent;
  let fixture: ComponentFixture<QrcodeprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrcodeprintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodeprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
