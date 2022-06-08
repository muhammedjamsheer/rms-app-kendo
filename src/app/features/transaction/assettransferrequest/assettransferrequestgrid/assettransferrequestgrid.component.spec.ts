import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssettransferrequestgridComponent } from './assettransferrequestgrid.component';

describe('AssettransferrequestgridComponent', () => {
  let component: AssettransferrequestgridComponent;
  let fixture: ComponentFixture<AssettransferrequestgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssettransferrequestgridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssettransferrequestgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
