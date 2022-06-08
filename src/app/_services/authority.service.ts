import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';
import { Api } from 'src/app/_api/mock.api';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../_elements/dialogs/login-dialog/login-dialog.component';
import { environment } from 'src/environments/environment';
import { Permission } from '../_enums/permission.enum';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorityService implements CanActivate {

  currentUserUuid$ = new BehaviorSubject<string|null>(null); // uuid
  private urlPermissions: {url: string, permission: Permission}[] = [
    { url: 'home', permission: Permission.GUEST},
    { url: 'personal-shift', permission: Permission.USER},
  ];

  constructor(
    private matDialog: MatDialog,
    private router: Router,
    private api: Api,
    private cookieService: CookieService,
    private usersService: UsersService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // get uuid from cookie if uuid is null
    if (!this.currentUserUuid$.value) {
      if (this.cookieService.check(environment.TAINAN_PUBLIC_WITNESSING_PERMISSION_TOKEN)) {
        this.currentUserUuid$.next(this.cookieService.get(environment.TAINAN_PUBLIC_WITNESSING_PERMISSION_TOKEN));
      }
    }

    const currentUrlPermission = this.urlPermissions.find(urlPermission => state.url.includes(urlPermission.url))?.permission;
    if (currentUrlPermission !== Permission.GUEST) {
      if (this.currentUserUuid$.value) {
        return this.usersService.getUserByUuid(this.currentUserUuid$.value).pipe(
          filter(user => !!user),
          first(),
          map(user => user.permission),
          map(userPermission => userPermission <= currentUrlPermission),
          tap(hasPermission => {
            if (!hasPermission) {
              this.router.navigate(['home']);
            }
          })
        );
      } else { // should login 
        return this.matDialog.open(LoginDialogComponent, {
          disableClose: true,
          panelClass: 'dialog-panel',
        }).afterClosed().pipe(
          first(),
          tap(result => {
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
  }

  logout = (): Promise<void> => {
    const uuid = this.currentUserUuid$.value;
    this.currentUserUuid$.next(null);
    return this.api.logout(uuid).then(() => {
      this.cookieService.delete(environment.TAINAN_PUBLIC_WITNESSING_PERMISSION_TOKEN);
      this.router.navigate(['home']);
    });
  }

  private resetPermissionCookie = () => {
    const expiresDate = new Date();
    expiresDate.setMinutes(expiresDate.getMinutes() + 10);
    this.cookieService.set(environment.TAINAN_PUBLIC_WITNESSING_PERMISSION_TOKEN, this.currentUserUuid$.value, {expires: expiresDate});
  }
}
