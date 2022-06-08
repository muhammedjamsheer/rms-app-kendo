import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferrquestgridComponent } from './transferrquestgrid.component';

describe('TransferrquestgridComponent', () => {
  let component: TransferrquestgridComponent;
  let fixture: ComponentFixture<TransferrquestgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferrquestgridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferrquestgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
