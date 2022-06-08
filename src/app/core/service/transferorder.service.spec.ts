import { TestBed } from '@angular/core/testing';

import { TransferorderService } from './transferorder.service';

describe('TransferorderService', () => {
  let service: TransferorderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferorderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
