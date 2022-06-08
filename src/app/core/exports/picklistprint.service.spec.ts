import { TestBed } from '@angular/core/testing';

import { PicklistprintService } from './picklistprint.service';

describe('PicklistprintService', () => {
  let service: PicklistprintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PicklistprintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
