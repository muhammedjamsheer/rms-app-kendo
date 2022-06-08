import { TestBed } from '@angular/core/testing';

import { TransferorderprintService } from './transferorderprint.service';

describe('TransferorderprintService', () => {
  let service: TransferorderprintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferorderprintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
