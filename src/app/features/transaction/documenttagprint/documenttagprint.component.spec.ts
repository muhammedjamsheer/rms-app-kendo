import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumenttagprintComponent } from './documenttagprint.component';

describe('DocumenttagprintComponent', () => {
  let component: DocumenttagprintComponent;
  let fixture: ComponentFixture<DocumenttagprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumenttagprintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumenttagprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
