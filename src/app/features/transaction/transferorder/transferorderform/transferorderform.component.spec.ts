import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferorderformComponent } from './transferorderform.component';

describe('TransferorderformComponent', () => {
  let component: TransferorderformComponent;
  let fixture: ComponentFixture<TransferorderformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferorderformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferorderformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
