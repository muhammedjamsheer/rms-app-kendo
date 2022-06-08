import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, Routes } from '@angular/router';

import { SitemastergridComponent } from './sitemastergrid.component';

describe('SitemastergridComponent', () => {
  let component: SitemastergridComponent;
  let fixture: ComponentFixture<SitemastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SitemastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SitemastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
