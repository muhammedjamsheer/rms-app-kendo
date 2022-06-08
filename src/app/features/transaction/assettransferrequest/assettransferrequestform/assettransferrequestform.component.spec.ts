import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssettransferrequestformComponent } from './assettransferrequestform.component';

describe('AssettransferrequestformComponent', () => {
  let component: AssettransferrequestformComponent;
  let fixture: ComponentFixture<AssettransferrequestformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssettransferrequestformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssettransferrequestformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
