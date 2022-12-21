import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, first, map, switchAll, tap } from 'rxjs/operators';
import { Api } from 'src/app/_api';
import { routes } from '../routes';
import { Permission } from '../_enums/permission.enum';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorityService implements CanActivate {
  currentUserUuid$ = new BehaviorSubject<string | null>(null); // uuid
  constructor(
    private router: Router,
    private api: Api,
    private usersService: UsersService,
    private fireAuth: AngularFireAuth
  ) {
    // fireAuth.authState.subscribe((user) => {
    //   debugger;
    //   const uuid = user?.email ? user.email.substring(0, 36) : null;
    //   this.currentUserUuid$.next(uuid);
    // });
  }

  canActivate(
    _: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.fireAuth.authState.pipe(
      map((user) => {
        const uuid = user?.email ? user.email.substring(0, 36) : null;
        this.currentUserUuid$.next(uuid);

        const route = routes.find((r) => r.pathRegexp.test(state.url));
        const currentUrlPermission = route?.permission ?? Permission.GUEST;
        if (currentUrlPermission === Permission.GUEST) {
          return of(true);
        }
        if (!uuid) return of(false);
        return this.usersService.getUserByUuid(uuid).pipe(
          filter((user) => !!user),
          first(),
          map((user) => user!.permission <= currentUrlPermission),
          tap((hasPermission) => {
            if (!hasPermission) {
              this.router.navigate(['home']);
            }
          })
        );
      }),
      switchAll()
    );
  }

  login = (uuid: string, password: string): Promise<void> => {
    return this.api.login(uuid, password);
  };

  customLogin = (firebaseCustomToken: string) => {
    return this.fireAuth
      .signInWithCustomToken(firebaseCustomToken)
      .then((value) => {
        console.log(value);
        return value;
      });
  };

  logout = (): Promise<void> => {
    this.currentUserUuid$.next(null);
    return this.api.logout().then(() => {
      this.router.navigate(['home']);
    });
  };

  canAccess = (
    accessPermission: Permission,
    userUuids?: string[]
  ): Observable<boolean> => {
    return this.currentUserUuid$.pipe(
      map((userUuid) => {
        if (userUuid) {
          return this.usersService.getUserByUuid(userUuid).pipe(
            first(),
            map((_user) => {
              const permission = _user?.permission ?? Permission.GUEST;
              if (permission <= accessPermission) {
                if (userUuids) {
                  if (userUuids.includes(userUuid)) {
                    return true;
                  } else {
                    return false;
                  }
                }
                return true;
              } else {
                return false;
              }
            })
          );
        } else {
          if (accessPermission === Permission.GUEST) {
            return of(true);
          } else {
            return of(false);
          }
        }
      }),
      switchAll()
    );
  };
}
