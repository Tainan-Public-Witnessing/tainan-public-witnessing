import { TestBed } from '@angular/core/testing';

import { AuthorityService } from './authority.service';
import { Router } from '@angular/router';

describe('AuthorityService', () => {
  let service: AuthorityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: {} }
      ]
    });
    service = TestBed.inject(AuthorityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
