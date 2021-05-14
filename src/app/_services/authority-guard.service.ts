import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { PermissionData } from 'src/app/_interfaces/profile.interface';
import { PermissionKey } from 'src/app/_enums/permission-key.enum';
import { AuthorityService } from './authority.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from 'src/app/_elements/dialogs/login-dialog/login-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AuthorityGuardService implements CanActivate {

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
    private router: Router,
    private authorityService: AuthorityService,
    private matDialog: MatDialog
  ) { }

  canActivate = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const key = this.PERMISSION_DATAS.find(permissionData => permissionData.urlKey === state.url.split(';')[0]).key;
    const access = this.authorityService.currentProfile$.getValue().permissions.find(permission => permission.key === key).access;
    if (access) {
      return true;
    } else {
      console.log('router', this.router, 'route', route, 'state', state);
      this.matDialog.open(LoginDialogComponent, {
        disableClose: true,
        panelClass: 'dialog-panel',
      }).afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate([state.url]);
        } else {
          this.router.navigate(['home']);
        }
      });
    }
  }
}
