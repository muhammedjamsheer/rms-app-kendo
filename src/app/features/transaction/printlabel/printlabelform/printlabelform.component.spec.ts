import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintlabelformComponent } from './printlabelform.component';

describe('PrintlabelformComponent', () => {
  let component: PrintlabelformComponent;
  let fixture: ComponentFixture<PrintlabelformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintlabelformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintlabelformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
