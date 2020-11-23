import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Permission, Profile } from 'src/app/_interfaces/profile.interface';
import { MockApi } from 'src/app/_api/mock.api';
import { PermissionKey } from 'src/app/_enums/permission-key.enum';
import { Status } from '../_enums/status.enum';
import { User } from '../_interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthorityService {

  currentUser$ = new BehaviorSubject<User>(null);
  currentProfile$ = new BehaviorSubject<Profile>(null);
  logout$ = new Subject<void>();
  subscription: Subscription;

  private guestProfile: Profile = {
    uuid: '',
    name: 'guest',
    permissions: [
      { key: PermissionKey.HOME_READ, access: true },
      { key: PermissionKey.CONGREGATIONS_READ, access: false },
      { key: PermissionKey.USERS_READ, access: false },
      { key: PermissionKey.TAGS_READ, access: false },
      { key: PermissionKey.PROFILES_READ, access: false },
      { key: PermissionKey.PROFILE_READ, access: false },
    ]
  };

  constructor(
    private mockApi: MockApi,
  ) { }

  initialize = () => {
    this.currentUser$.subscribe(user => {
      if (user) {
        this.mockApi.readProfile(user.profile).subscribe(this.currentProfile$);
      } else {
        this.currentProfile$.next(this.guestProfile);
      }
    });
  }

  getPermissionByKey = (key: PermissionKey): Observable<Permission> => {
    return this.currentProfile$.pipe(
      map(profile => profile.permissions.find(permission => permission.key === key))
    );
  }

  login = (uuid: string, password: string): Promise<Status> => {
    return this.mockApi.login(uuid, password).then(() => {
      this.subscription = this.mockApi.readUser(uuid).subscribe(this.currentUser$);
      return Promise.resolve(Status.SUCCESS);
    });
  }

  logout = () => {
    this.mockApi.logout(this.currentUser$.getValue().uuid).then(() => {
      this.subscription.unsubscribe();
      this.currentUser$.next(null);
    });
  }
}
