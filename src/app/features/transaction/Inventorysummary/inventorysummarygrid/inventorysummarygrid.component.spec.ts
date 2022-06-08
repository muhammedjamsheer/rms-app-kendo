import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorysummarygridComponent } from './inventorysummarygrid.component';

describe('InventorysummarygridComponent', () => {
  let component: InventorysummarygridComponent;
  let fixture: ComponentFixture<InventorysummarygridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventorysummarygridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorysummarygridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
