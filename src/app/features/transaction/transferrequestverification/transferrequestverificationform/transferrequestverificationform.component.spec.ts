import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferrequestverificationformComponent } from './transferrequestverificationform.component';

describe('TransferrequestverificationformComponent', () => {
  let component: TransferrequestverificationformComponent;
  let fixture: ComponentFixture<TransferrequestverificationformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferrequestverificationformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferrequestverificationformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
