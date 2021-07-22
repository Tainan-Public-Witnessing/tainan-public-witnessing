import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Api } from 'src/app/_api/mock.api';
import { ProfilesService } from './profiles.service';
import { Profile } from 'src/app/_interfaces/profile.interface';
import { PermissionKey } from 'src/app/_enums/permission-key.enum';
import { Status } from 'src/app/_enums/status.enum';
import { User } from 'src/app/_interfaces/user.interface';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorityService {

  currentUser$ = new BehaviorSubject<User>(null);
  currentProfile$ = new BehaviorSubject<Profile>(null);
  logout$ = new Subject<void>();
  subscription: Subscription;

  constructor(
    private api: Api,
    private router: Router,
    private profilesService: ProfilesService,
    private usersService: UsersService
  ) {
    // tslint:disable-next-line: no-string-literal
    if (window['Cypress']) {
      // tslint:disable-next-line: no-string-literal
      window['AuthorityService'] = this;
    }
  }

  initialize = () => {
    this.currentUser$.subscribe(user => {
      if (user) {
        this.profilesService.getProfileByUuid(user.profile).subscribe(this.currentProfile$);
      } else {
        // guest profile
        this.currentProfile$.next(this.profilesService.getProfileByUuid('PROFILE_GUEST_UUID').getValue());
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
      this.subscription = this.usersService.getUserByUuid(uuid, { immortal: true }).subscribe(this.currentUser$);
      return Promise.resolve(Status.SUCCESS);
    });
  }

  logout = () => {
    const uuid = this.currentUser$.getValue().uuid;
    this.api.logout(uuid).then(() => {
      this.usersService.removeImmortal(uuid);  // set immortal user to normal user
      this.subscription.unsubscribe();  // keep currentUser$ alive
      this.currentUser$.next(null);
      this.router.navigate(['home']);
    });
  }
}
