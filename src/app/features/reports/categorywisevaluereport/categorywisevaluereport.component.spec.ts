import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorywisevaluereportComponent } from './categorywisevaluereport.component';

describe('CategorywisevaluereportComponent', () => {
  let component: CategorywisevaluereportComponent;
  let fixture: ComponentFixture<CategorywisevaluereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategorywisevaluereportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorywisevaluereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
