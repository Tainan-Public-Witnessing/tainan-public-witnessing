import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
import { LoginDialogComponent } from '../_elements/dialogs/login-dialog/login-dialog.component';
import { Mode } from '../_enums/mode.enum';
import { Permission } from '../_enums/permission.enum';
import { User } from '../_interfaces/user.interface';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorityService implements CanActivate {
  currentUserUuid$ = new BehaviorSubject<string | null>(null); // uuid
  private urlPermissions: { url: string; permission: Permission }[] = [
    { url: 'home', permission: Permission.GUEST },
    { url: 'personal-shift', permission: Permission.USER },
    { url: 'shifts', permission: Permission.MANAGER },
    { url: 'users/:mode/:uuid?', permission: Permission.MANAGER },
    { url: `users/${Mode.CREATE}`, permission: Permission.ADMINISTRATOR },
    { url: 'users', permission: Permission.MANAGER },
    { url: 'profile', permission: Permission.USER },
    { url: 'callback', permission: Permission.USER },
  ];

  constructor(
    private matDialog: MatDialog,
    private router: Router,
    private api: Api,
    private cookieService: CookieService,
    private usersService: UsersService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
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

    const currentUrlPermission = this.urlPermissions.find((urlPermission) =>
      state.url.includes(urlPermission.url)
    )?.permission as Permission;
    if (currentUrlPermission !== Permission.GUEST) {
      if (this.currentUserUuid$.value) {
        return this.usersService
          .getUserByUuid(this.currentUserUuid$.value)
          .pipe(
            filter((user) => !!user),
            map((user) => user as User),
            first(),
            map((user) => user.permission),
            map((userPermission) => userPermission <= currentUrlPermission),
            tap((hasPermission) => {
              if (!hasPermission) {
                this.router.navigate(['home']);
              }
            })
          );
      } else {
        // should login
        return this.matDialog
          .open(LoginDialogComponent, {
            disableClose: true,
            panelClass: 'dialog-panel',
          })
          .afterClosed()
          .pipe(
            first(),
            tap((result) => {
              if (!result) {
                this.router.navigate(['home']);
              }
            })
          );
      }
    } else {
      return true;
    }
  }

  login = (uuid: string, password: string): Promise<void> => {
    return this.api.login(uuid, password).then(() => {
      this.currentUserUuid$.next(uuid);
      this.resetPermissionCookie();
    });
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
