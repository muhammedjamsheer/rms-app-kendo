import { TestBed } from '@angular/core/testing';

import { ShipmemtprintService } from './shipmemtprint.service';

describe('ShipmemtprintService', () => {
  let service: ShipmemtprintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShipmemtprintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
