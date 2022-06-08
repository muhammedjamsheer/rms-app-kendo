import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacrofileupdateComponent } from './macrofileupdate.component';

describe('MacrofileupdateComponent', () => {
  let component: MacrofileupdateComponent;
  let fixture: ComponentFixture<MacrofileupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MacrofileupdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MacrofileupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
