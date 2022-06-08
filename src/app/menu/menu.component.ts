import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
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
export class MenuComponent implements OnInit, OnDestroy {

  MENU_LINKS: MenuLink[] = [
    { display: 'HOME.TITLE', url: 'home', permissionKey: PermissionKey.HOME_READ },
    // { display: 'USERS.TITLE', url: 'users', permissionKey: PermissionKey.USERS_READ},
    // { display: 'CONGREGATIONS.TITLE', url: 'congregations', permissionKey: PermissionKey.CONGREGATIONS_READ},
    // { display: 'TAGS.TITLE', url: 'tags', permissionKey: PermissionKey.TAGS_READ},
    // { display: 'PROFILES.TITLE', url: 'profiles', permissionKey: PermissionKey.PROFILES_READ},
  ];

  currentMenuLinks$ = new BehaviorSubject<MenuLink[]>(this.MENU_LINKS);
  isLoggedIn$ = new BehaviorSubject<boolean>(false);
  destroy$ = new Subject<void>();

  constructor(
    private authorityService: AuthorityService,
    private globalEventService: GlobalEventService,
    private matDiolog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.authorityService.currentUserUuid$.pipe(
      takeUntil(this.destroy$),
      map(uuid => !!uuid)
    ).subscribe(isLoggedIn => this.isLoggedIn$.next(isLoggedIn));
  }

  ngOnDestroy(): void {
   this.destroy$.next();
   this.destroy$.complete(); 
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
