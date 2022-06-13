import { TestBed } from '@angular/core/testing';

import { TransferreturnService } from './transferreturn.service';

describe('TransferreturnService', () => {
  let service: TransferreturnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferreturnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
