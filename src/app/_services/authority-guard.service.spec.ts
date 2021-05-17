import { TestBed } from '@angular/core/testing';

import { AuthorityGuardService } from './authority-guard.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

describe('AuthorityGuardService', () => {
  let service: AuthorityGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: {} },
        { provide: MatDialog, useValue: {} },
      ]
    });
    service = TestBed.inject(AuthorityGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
