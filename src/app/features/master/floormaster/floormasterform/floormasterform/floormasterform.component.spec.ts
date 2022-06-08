import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloormasterformComponent } from './floormasterform.component';

describe('FloormasterformComponent', () => {
  let component: FloormasterformComponent;
  let fixture: ComponentFixture<FloormasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloormasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloormasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
