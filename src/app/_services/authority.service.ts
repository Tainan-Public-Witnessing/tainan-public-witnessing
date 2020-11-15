import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Permission, Profile } from 'src/app/_interfaces/profile.interface';
import { MockApi } from 'src/app/_api/mock.api';
import { PermissionKey } from 'src/app/_enums/permission-key.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthorityService {

  currentProfile$ = new BehaviorSubject<Profile>(null);

  constructor(
    private mockApi: MockApi
  ) { }

  initialize = () => {
    this.mockApi.readProfile('e90966a2-91a8-5480-bc02-64f88277e5a1').subscribe(this.currentProfile$);
  }

  getPermissionByKey = (key: PermissionKey): Observable<Permission> => {
    return this.currentProfile$.pipe(
      map(profile => profile.permissions.find(permission => permission.key === key))
    );
  }
}
