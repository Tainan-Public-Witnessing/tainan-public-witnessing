import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { filter, first, map, switchAll, takeUntil } from 'rxjs/operators';
import { MenuLink } from 'src/app/_interfaces/menu-link.interface';
import { AuthorityService } from 'src/app/_services/authority.service';
import { GlobalEventService } from 'src/app/_services/global-event.service';
import { routes } from '../routes';
import { Permission } from '../_enums/permission.enum';
import { User } from '../_interfaces/user.interface';
import { UsersService } from '../_services/users.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  MENU_LINKS: MenuLink[] = routes
    .filter((route) => route.menu !== false)
    .map((route) => ({
      display: route.label!,
      url: route.path,
      permission: route.permission,
    }));

  currentMenuLinks$ = new BehaviorSubject<MenuLink[]>([]);
  isLoggedIn$ = new BehaviorSubject<boolean>(false);
  destroy$ = new Subject<void>();

  constructor(
    private authorityService: AuthorityService,
    private globalEventService: GlobalEventService,
    private matDiolog: MatDialog,
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authorityService.currentUserUuid$
      .pipe(
        takeUntil(this.destroy$),
        map((uuid) => !!uuid)
      )
      .subscribe((isLoggedIn) => this.isLoggedIn$.next(isLoggedIn));

    this.authorityService.currentUserUuid$
      .pipe(
        takeUntil(this.destroy$),
        map((uuid) => {
          if (uuid === null) {
            return of(Permission.GUEST);
          } else {
            return this.usersService.getUserByUuid(uuid).pipe(
              filter((user) => !!user),
              map((user) => user as User),
              first(),
              map((user) => user.permission)
            );
          }
        }),
        switchAll(),
        map((permission) =>
          this.MENU_LINKS.filter(
            (menuLink) => menuLink.permission >= permission
          )
        )
      )
      .subscribe((menuLink) => this.currentMenuLinks$.next(menuLink));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMenuLinkClick = () => {
    this.globalEventService.emitGlobalEvent({
      id: 'ON_MENU_LINK_CLICK',
    });
  };

  onLoginClick = () => {
    this.globalEventService.emitGlobalEvent({
      id: 'ON_MENU_LINK_CLICK',
    });

    this.router.navigateByUrl('/login');
  };

  onLogoutClick = () => {
    this.globalEventService.emitGlobalEvent({
      id: 'ON_MENU_LINK_CLICK',
    });

    this.authorityService.logout();
  };
}
