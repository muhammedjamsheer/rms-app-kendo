import { TestBed } from '@angular/core/testing';

import { WarehousemasterService } from './warehousemaster.service';

describe('WarehousemasterService', () => {
  let service: WarehousemasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WarehousemasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
