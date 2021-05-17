import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuLink } from 'src/app/_interfaces/menu-link.interface';
import { LoginDialogComponent } from 'src/app/_elements/dialogs/login-dialog/login-dialog.component';
import { PermissionKey } from 'src/app/_enums/permission-key.enum';
import { AuthorityService } from 'src/app/_services/authority.service';
import { GlobalEventService } from 'src/app/_services/global-event.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  MENU_LINKS: MenuLink[] = [
    { display: 'HOME.TITLE', url: 'home', permissionKey: PermissionKey.HOME_READ },
    { display: 'USERS.TITLE', url: 'users', permissionKey: PermissionKey.USERS_READ},
    { display: 'CONGREGATIONS.TITLE', url: 'congregations', permissionKey: PermissionKey.CONGREGATIONS_READ},
    { display: 'TAGS.TITLE', url: 'tags', permissionKey: PermissionKey.TAGS_READ},
    { display: 'PROFILES.TITLE', url: 'profiles', permissionKey: PermissionKey.PROFILES_READ},
  ];

  currentMenuLinks$: Observable<MenuLink[]>;
  isLoggedIn$: Observable<boolean>;

  constructor(
    private authorityService: AuthorityService,
    private globalEventService: GlobalEventService,
    private matDiolog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.currentMenuLinks$ = this.authorityService.currentProfile$.pipe(
      map(profile => this.MENU_LINKS.filter(menuLink => {
        return profile.permissions.find(permission => permission.key === menuLink.permissionKey).access;
      }))
    );

    this.isLoggedIn$ = this.authorityService.currentUser$.pipe(map(user => !!user));
  }

  onMenuLinkClick = () => {
    this.globalEventService.emitGlobalEvent({
      id: 'ON_MENU_LINK_CLICK'
    });
  }

  onLoginClick = () => {
    this.globalEventService.emitGlobalEvent({
      id: 'ON_MENU_LINK_CLICK'
    });

    this.matDiolog.open(LoginDialogComponent, {
      disableClose: true,
      panelClass: 'dialog-panel',
    });
  }

  onLogoutClick = () => {
    this.globalEventService.emitGlobalEvent({
      id: 'ON_MENU_LINK_CLICK'
    });

    this.authorityService.logout();
  }
}
