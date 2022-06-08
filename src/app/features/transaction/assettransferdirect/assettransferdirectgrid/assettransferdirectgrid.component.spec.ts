import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssettransferdirectgridComponent } from './assettransferdirectgrid.component';

describe('AssettransferdirectgridComponent', () => {
  let component: AssettransferdirectgridComponent;
  let fixture: ComponentFixture<AssettransferdirectgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssettransferdirectgridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssettransferdirectgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
