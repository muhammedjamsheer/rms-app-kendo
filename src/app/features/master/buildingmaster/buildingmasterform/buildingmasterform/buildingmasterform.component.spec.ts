import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingmasterformComponent } from './buildingmasterform.component';

describe('BuildingmasterformComponent', () => {
  let component: BuildingmasterformComponent;
  let fixture: ComponentFixture<BuildingmasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildingmasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingmasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
