import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoommasterformComponent } from './roommasterform.component';

describe('RoommasterformComponent', () => {
  let component: RoommasterformComponent;
  let fixture: ComponentFixture<RoommasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoommasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoommasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
