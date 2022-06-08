import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomermasterformComponent } from './customermasterform.component';

describe('CustomermasterformComponent', () => {
  let component: CustomermasterformComponent;
  let fixture: ComponentFixture<CustomermasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomermasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomermasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
