import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProfilePrimarykey } from 'src/app/_interfaces/profile.interface';
import { MockApi } from 'src/app/_api/mock.api';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {

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
}
