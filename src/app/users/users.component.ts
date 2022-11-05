import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
  take,
  takeUntil
} from 'rxjs/operators';
import { ConfirmDialogData } from 'src/app/_elements/dialogs/confirm-dialog/confirm-dialog-data.interface';
import { Mode } from 'src/app/_enums/mode.enum';
import { Permission } from 'src/app/_enums/permission.enum';
import { UserKey } from 'src/app/_interfaces/user.interface';
import { AuthorityService } from 'src/app/_services/authority.service';
import { UsersService } from 'src/app/_services/users.service';
import { ConfirmDialogComponent } from '../_elements/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  reloadList$ = new BehaviorSubject<void>(undefined);
  userPrimarykeys$ = new BehaviorSubject<UserKey[] | null>(null);
  userCreateAccess$ = new BehaviorSubject<boolean>(false);
  userUpdateAccess$ = new BehaviorSubject<boolean>(false);
  userDeleteAccess$ = new BehaviorSubject<boolean>(false);
  unsubscribe$ = new Subject<void>();

  filterValue$ = new BehaviorSubject<string>('');

  constructor(
    private authorityService: AuthorityService,
    private translateService: TranslateService,
    private router: Router,
    private matDialog: MatDialog,
    public usersService: UsersService // public for checking immortal user
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.reloadList$.pipe(
        startWith(undefined),
        switchMap(() => {
          return this.usersService
            .getUserKeys()
            .pipe(takeUntil(this.unsubscribe$));
        })
      ),
      this.filterValue$.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      ),
    ]).subscribe(([users, filter]) => {
      if (!users) return [];
      try {
        const filterReg = new RegExp(filter, 'i');
        this.userPrimarykeys$.next(
          users
            .filter((user) => filterReg.test(user.username))
            .sort((a, b) =>
              a.username > b.username ? 1 : b.username > a.username ? -1 : 0
            )
        );
      } catch {}
    });

    const admin = this.authorityService
      .canAccess(Permission.ADMINISTRATOR)
      .pipe(takeUntil(this.unsubscribe$));
    admin.subscribe(this.userCreateAccess$);
    admin.subscribe(this.userUpdateAccess$);
    admin.subscribe(this.userDeleteAccess$);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onAddButtonClick = () => {
    this.router.navigate(['users', Mode.CREATE]);
  };

  onEditButtonClick = (evt: Event, userKey: UserKey) => {
    evt.stopPropagation();
    this.router.navigate(['users', Mode.UPDATE, userKey.uuid]);
  };

  onDeactivateButtonClick = (evt: Event, userKey: UserKey) => {
    evt.stopPropagation();

    const action = !userKey.activate ? 'ACTIVATE' : 'DEACTIVATE';
    this.matDialog
      .open<ConfirmDialogComponent, ConfirmDialogData, boolean>(
        ConfirmDialogComponent,
        {
          data: {
            title: `USERS.${action}_TITLE`,
            titleParams: {
              value: userKey.username,
            },
            message: `USERS.${action}_MESSAGE`,
            messageParams: {
              value: userKey.username,
            },
          },
        }
      )
      .afterClosed()
      .pipe(take(1))
      .subscribe(async (result) => {
        if (result) {
          const futureShifts = await this.usersService.updateUserActivation(
            userKey.uuid,
            !userKey.activate
          );
          if (futureShifts.length) {
            const shiftsSummary = futureShifts
              .map(
                (shift) =>
                  `${shift.date}\t${shift.site.name}\t${shift.hour.name}`
              )
              .join('\n');

            this.matDialog.open<
              ConfirmDialogComponent,
              ConfirmDialogData,
              boolean
            >(ConfirmDialogComponent, {
              data: {
                title: 'GLOBAL.ERROR',
                message: 'USERS.PERSONAL_SHIFTS_EXIST_ERROR',
                messageParams: {
                  date: shiftsSummary,
                },
                hideCancelButton: true,
              },
            });
          } else {
            this.reloadList$.next(undefined);
          }
        }
      });
  };

  onInfoButtonClick = (userKey: UserKey) => {
    this.router.navigate(['users', Mode.READ, userKey.uuid]);
  };
}
