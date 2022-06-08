import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PicklistformComponent } from './picklistform.component';

describe('PicklistformComponent', () => {
  let component: PicklistformComponent;
  let fixture: ComponentFixture<PicklistformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PicklistformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PicklistformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
