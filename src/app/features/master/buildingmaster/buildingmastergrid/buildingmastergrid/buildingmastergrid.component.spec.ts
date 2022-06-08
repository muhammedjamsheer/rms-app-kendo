import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingmastergridComponent } from './buildingmastergrid.component';

describe('BuildingmastergridComponent', () => {
  let component: BuildingmastergridComponent;
  let fixture: ComponentFixture<BuildingmastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildingmastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingmastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
