import { TestBed } from '@angular/core/testing';

import { ReceiptprintService } from './receiptprint.service';

describe('ReceiptprintService', () => {
  let service: ReceiptprintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceiptprintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
