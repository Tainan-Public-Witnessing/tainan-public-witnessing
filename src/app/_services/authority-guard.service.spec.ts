import { TestBed } from '@angular/core/testing';

import { AuthorityGuardService } from './authority-guard.service';

describe('AuthorityGuardService', () => {
  let service: AuthorityGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorityGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
