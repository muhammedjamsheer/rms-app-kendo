import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssettransferdirectformComponent } from './assettransferdirectform.component';

describe('AssettransferdirectformComponent', () => {
  let component: AssettransferdirectformComponent;
  let fixture: ComponentFixture<AssettransferdirectformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssettransferdirectformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssettransferdirectformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
