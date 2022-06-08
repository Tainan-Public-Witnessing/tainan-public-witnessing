import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { Api } from 'src/app/_api/mock.api';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../_elements/dialogs/login-dialog/login-dialog.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthorityService implements CanActivate {

  currentUserUuid$ = new BehaviorSubject<string|null>(null); // uuid

  constructor(
    private matDialog: MatDialog,
    private router: Router,
    private api: Api,
    private cookieService: CookieService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.cookieService.check(environment.TAINAN_PUBLIC_WITNESSING_PERMISSION_TOKEN)) {
      this.currentUserUuid$.next(this.cookieService.get(environment.TAINAN_PUBLIC_WITNESSING_PERMISSION_TOKEN));
      this.resetPermissionCookie();
      return true;
    } else {
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
