import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Api } from 'src/app/_api/mock.api';
import { ProfilesService } from './profiles.service';
import { PermissionData, Profile } from 'src/app/_interfaces/profile.interface';
import { PermissionKey } from 'src/app/_enums/permission-key.enum';
import { Status } from 'src/app/_enums/status.enum';
import { User } from 'src/app/_interfaces/user.interface';
import { UsersService } from './users.service';

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

  constructor(
    private api: Api,
    private router: Router,
    private profilesService: ProfilesService,
    private usersService: UsersService
  ) { }

  initialize = () => {
    this.currentUser$.subscribe(user => {
      if (user) {
        this.profilesService.getProfileByUuid(user.profile).subscribe(this.currentProfile$);
      } else {
        // guest profile
        this.currentProfile$.next(this.profilesService.getProfileByUuid('e90966a2-91a8-6480-bc02-67f68267e5a1').getValue());
      }
    });
  }

  getPermissionByKey = (key: PermissionKey): Observable<boolean> => {
    return this.currentProfile$.pipe(
      map(profile => profile.permissions.find(permission => permission.key === key).access)
    );
  }

  login = (uuid: string, password: string): Promise<Status> => {
    return this.api.login(uuid, password).then(() => {
      this.subscription = this.usersService.getUserByUuid(uuid, {immortal: true}).subscribe(this.currentUser$);
      return Promise.resolve(Status.SUCCESS);
    });
  }

  logout = () => {
    this.api.logout(this.currentUser$.getValue().uuid).then(() => {
      this.subscription.unsubscribe();
      this.currentUser$.next(null);
      this.router.navigate(['home']);
    });
  }

  canActivate = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const key = this.PERMISSION_DATAS.find(permissionData => permissionData.urlKey === state.url.split(';')[0]).key;
    const access = this.currentProfile$.getValue().permissions.find(permission => permission.key === key).access;
    if (access) {
      return true;
    } else {
      this.router.navigate(['home']);
    }
  }
}
