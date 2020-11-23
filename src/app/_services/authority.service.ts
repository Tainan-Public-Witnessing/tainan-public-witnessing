import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Permission, PermissionData, Profile } from 'src/app/_interfaces/profile.interface';
import { MockApi } from 'src/app/_api/mock.api';
import { PermissionKey } from 'src/app/_enums/permission-key.enum';
import { Status } from '../_enums/status.enum';
import { User } from '../_interfaces/user.interface';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthorityService implements CanActivate {

  currentUser$ = new BehaviorSubject<User>(null);
  currentProfile$ = new BehaviorSubject<Profile>(null);
  logout$ = new Subject<void>();
  subscription: Subscription;

  private PERMISSION_DATAS: PermissionData[] = [
    { key: PermissionKey.HOME_READ, urlKey: '/home', description: 'Can read Home page' },
    { key: PermissionKey.CONGREGATIONS_READ, urlKey: '/congregations', description: 'Can read Congregations page' },
    { key: PermissionKey.USERS_READ, urlKey: '/users', description: 'Can read users page' },
    { key: PermissionKey.USER_READ, urlKey: '/user/read', description: '' },
    { key: PermissionKey.USER_CREATE, urlKey: '/user/create', description: '' },
    { key: PermissionKey.USER_UPDATE, urlKey: '/user/update', description: '' },
    { key: PermissionKey.TAGS_READ, urlKey: '/tags', description: 'Can read Tags page' },
    { key: PermissionKey.PROFILES_READ, urlKey: '/profiles', description: 'Can read Profiles page' },
    { key: PermissionKey.PROFILE_READ, urlKey: '/profile/read', description: '' },
    { key: PermissionKey.PROFILE_CREATE, urlKey: '/profile/create', description: '' },
    { key: PermissionKey.PROFILE_UPDATE, urlKey: '/profile/update', description: '' },
  ];

  private guestProfile: Profile = {
    uuid: '',
    name: 'guest',
    permissions: [
      { key: PermissionKey.HOME_READ, access: true },
      { key: PermissionKey.CONGREGATIONS_READ, access: false },
      { key: PermissionKey.USERS_READ, access: false },
      { key: PermissionKey.USER_READ, access: false },
      { key: PermissionKey.USER_CREATE, access: false },
      { key: PermissionKey.USER_UPDATE, access: false },
      { key: PermissionKey.TAGS_READ, access: false },
      { key: PermissionKey.PROFILES_READ, access: false },
      { key: PermissionKey.PROFILE_READ, access: false },
      { key: PermissionKey.PROFILE_CREATE, access: false },
      { key: PermissionKey.PROFILE_UPDATE, access: false },
    ]
  };

  constructor(
    private mockApi: MockApi,
    private router: Router,
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

  canActivate = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    // console.log('url', state.url.split(';')[0]);
    const key = this.PERMISSION_DATAS.find(permissionData => permissionData.urlKey === state.url.split(';')[0]).key;
    const access = this.currentProfile$.getValue().permissions.find(permission => permission.key === key).access;
    if (access) {
      return true;
    } else {
      this.router.navigate(['home']);
    }
  }
}
