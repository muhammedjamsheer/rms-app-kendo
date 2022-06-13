import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferreturngridComponent } from './transferreturngrid.component';

describe('TransferreturngridComponent', () => {
  let component: TransferreturngridComponent;
  let fixture: ComponentFixture<TransferreturngridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferreturngridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferreturngridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
