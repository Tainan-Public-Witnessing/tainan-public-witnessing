import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, first, map, switchAll, tap } from 'rxjs/operators';
import { Api } from 'src/app/_api';
import { environment } from 'src/environments/environment';
import { routes } from '../routes';
import { Permission } from '../_enums/permission.enum';
import { User } from '../_interfaces/user.interface';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorityService implements CanActivate {
  currentUserUuid$ = new BehaviorSubject<string | null>(null); // uuid

  constructor(
    private router: Router,
    private api: Api,
    private cookieService: CookieService,
    private usersService: UsersService,
    private fireAuth: AngularFireAuth
  ) {}

  canActivate(
    _: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    // get uuid from cookie if uuid is null
    if (!this.currentUserUuid$.value) {
      if (
        this.cookieService.check(
          environment.TAINAN_PUBLIC_WITNESSING_PERMISSION_TOKEN
        )
      ) {
        this.currentUserUuid$.next(
          this.cookieService.get(
            environment.TAINAN_PUBLIC_WITNESSING_PERMISSION_TOKEN
          )
        );
      }
    }

    const route = routes.find((r) => r.pathRegexp.test(state.url));
    const currentUrlPermission = route?.permission ?? Permission.GUEST;
    if (currentUrlPermission === Permission.GUEST) {
      return true;
    }
    if (this.currentUserUuid$.value) {
      return this.usersService.getUserByUuid(this.currentUserUuid$.value).pipe(
        filter((user) => !!user),
        first(),
        map((user) => user!.permission <= currentUrlPermission),
        tap((hasPermission) => {
          if (!hasPermission) {
            this.router.navigate(['home']);
          }
        })
      );
    } else {
      return this.router.navigateByUrl(
        `/login?return=${encodeURIComponent(window.location.href)}`
      );
    }
  }

  login = (uuid: string, password: string): Promise<void> => {
    return this.api.login(uuid, password).then(() => {
      this.currentUserUuid$.next(uuid);
      this.resetPermissionCookie();
    });
  };

  customLogin = async (firebaseCustomToken: string) => {
    const result = await this.fireAuth.signInWithCustomToken(
      firebaseCustomToken
    );
    this.currentUserUuid$.next(result.user!.email!.slice(0, 36));
    this.resetPermissionCookie();
  };

  logout = (): Promise<void> => {
    const uuid = this.currentUserUuid$.value as string;
    this.currentUserUuid$.next(null);
    return this.api.logout().then(() => {
      this.cookieService.delete(
        environment.TAINAN_PUBLIC_WITNESSING_PERMISSION_TOKEN
      );
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
            filter((_user) => _user !== null),
            first(),
            map((_user) => {
              if ((_user as User).permission <= accessPermission) {
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

  private resetPermissionCookie = () => {
    const expiresDate = new Date();
    // expiresDate.setMinutes(expiresDate.getMinutes() + 10);
    // this.cookieService.set(environment.TAINAN_PUBLIC_WITNESSING_PERMISSION_TOKEN, this.currentUserUuid$.value, {expires: expiresDate});
    this.cookieService.set(
      environment.TAINAN_PUBLIC_WITNESSING_PERMISSION_TOKEN,
      this.currentUserUuid$.value as string
    );
  };
}
