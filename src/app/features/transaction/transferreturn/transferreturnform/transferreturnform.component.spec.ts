import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferreturnformComponent } from './transferreturnform.component';

describe('TransferreturnformComponent', () => {
  let component: TransferreturnformComponent;
  let fixture: ComponentFixture<TransferreturnformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferreturnformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferreturnformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
