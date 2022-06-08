import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferordergridComponent } from './transferordergrid.component';

describe('TransferordergridComponent', () => {
  let component: TransferordergridComponent;
  let fixture: ComponentFixture<TransferordergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferordergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferordergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
