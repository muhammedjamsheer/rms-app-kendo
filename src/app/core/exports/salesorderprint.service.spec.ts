import { TestBed } from '@angular/core/testing';

import { SalesorderprintService } from './salesorderprint.service';

describe('SalesorderprintService', () => {
  let service: SalesorderprintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesorderprintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
