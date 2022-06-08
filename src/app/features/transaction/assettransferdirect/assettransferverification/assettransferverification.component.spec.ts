import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssettransferverificationComponent } from './assettransferverification.component';

describe('AssettransferverificationComponent', () => {
  let component: AssettransferverificationComponent;
  let fixture: ComponentFixture<AssettransferverificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssettransferverificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssettransferverificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
