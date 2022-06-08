import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintexistingstockComponent } from './printexistingstock.component';

describe('PrintexistingstockComponent', () => {
  let component: PrintexistingstockComponent;
  let fixture: ComponentFixture<PrintexistingstockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintexistingstockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintexistingstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
