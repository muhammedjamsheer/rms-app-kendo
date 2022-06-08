import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitemasterformComponent } from './sitemasterform.component';

describe('SitemasterformComponent', () => {
  let component: SitemasterformComponent;
  let fixture: ComponentFixture<SitemasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SitemasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SitemasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
