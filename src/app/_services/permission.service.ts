import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Profile, ProfilePrimarykey } from 'src/app/_interfaces/profile.interface';
import { MockApi } from 'src/app/_api/mock.api';
import { PermissionKey } from '../_enums/permission-key.enum';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  profile$ = new BehaviorSubject<Profile>(null);
  profilePrimarykeys$ = new BehaviorSubject<ProfilePrimarykey[]>(null);

  constructor(
    private mockApi: MockApi
  ) { }

  loadProfilePrimarykeys = () => {
    if (!this.profilePrimarykeys$.getValue()) {
      this.mockApi.readProfilePrimarykeys().subscribe(this.profilePrimarykeys$);
    }
  }

  sortProfilePrimarykeys = (profilePrimarykeys: ProfilePrimarykey[]) => {
    return this.mockApi.sortProfilePrimarykeys(profilePrimarykeys);
  }

  loadProfile = (uuid: string) => {
    if (!this.profile$.getValue()) {
      this.mockApi.readProfile(uuid).subscribe(this.profile$);
    }
  }

  getPermissionByKey = (key: string): Observable<boolean> => {
    return this.profile$.pipe(
      map(profile => profile[key])
    );
  }
}
