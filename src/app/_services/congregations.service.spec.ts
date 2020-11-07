import { TestBed } from '@angular/core/testing';

import { CongregationsService } from './congregations.service';

describe('CongregationsService', () => {
  let service: CongregationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CongregationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
