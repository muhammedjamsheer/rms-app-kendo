import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManaultoreceiptformComponent } from './manaultoreceiptform.component';

describe('ManaultoreceiptformComponent', () => {
  let component: ManaultoreceiptformComponent;
  let fixture: ComponentFixture<ManaultoreceiptformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManaultoreceiptformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManaultoreceiptformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
