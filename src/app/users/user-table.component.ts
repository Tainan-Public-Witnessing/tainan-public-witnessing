import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, map, Subject } from 'rxjs';
import { startWith, switchMap, take, takeUntil } from 'rxjs/operators';
import { ConfirmDialogData } from 'src/app/_elements/dialogs/confirm-dialog/confirm-dialog-data.interface';
import { Mode } from 'src/app/_enums/mode.enum';
import { Permission } from 'src/app/_enums/permission.enum';
import { UserKey } from 'src/app/_interfaces/user.interface';
import { AuthorityService } from 'src/app/_services/authority.service';
import { UsersService } from 'src/app/_services/users.service';
import { ConfirmDialogComponent } from '../_elements/dialogs/confirm-dialog/confirm-dialog.component';
import { User } from './../_interfaces/user.interface';
import { CongregationsService } from './../_services/congregations.service';

@Component({
  selector: 'app-users',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent implements OnInit, OnDestroy, AfterViewInit {
  reloadList$ = new Subject<void>();

  users$ = new BehaviorSubject<User[] | null>(null);

  usersFilter$ = new BehaviorSubject<any>({});

  displayingUsers$ = new BehaviorSubject<User[]>([]);
  tableDataSource = new MatTableDataSource<User>();

  userCreateAccess$ = new BehaviorSubject<boolean>(false);
  userUpdateAccess$ = new BehaviorSubject<boolean>(false);
  userDeleteAccess$ = new BehaviorSubject<boolean>(false);

  unsubscribe$ = new Subject<void>();

  filterValue$ = new BehaviorSubject<string>('');
  displayingColumns = [
    'activate',
    'username',
    'gender',
    'congregationUuid',
    'permission',
    'baptizeDate',
    'cellphone',
    'phone',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private authorityService: AuthorityService,
    // private translateService: TranslateService,
    private router: Router,
    private matDialog: MatDialog,
    private usersService: UsersService,
    private congregationService: CongregationsService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.reloadList$.pipe(
        startWith(undefined),
        switchMap(() =>
          this.usersService.getAllUsers().pipe(takeUntil(this.unsubscribe$))
        )
      ),
      this.congregationService.getCongregations().pipe(
        map((congs) => {
          const dict: Record<string, string> = {};
          if (congs) {
            for (const cong of congs) {
              dict[cong.uuid] = cong.name;
            }
          }
          return dict;
        })
      ),
    ]).subscribe(([users, congregations]) => {
      users?.forEach((user) => {
        user.congregationUuid = congregations[user.congregationUuid];
      });
      this.users$.next(users || []);
    });

    this.users$.subscribe((users) => (this.tableDataSource.data = users || []));

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

  ngAfterViewInit(): void {
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;
  }

  onAddButtonClick = () => {
    this.router.navigate(['users', Mode.CREATE]);
  };

  onEditButtonClick = (evt: Event, userKey: UserKey) => {
    evt.stopPropagation();
    this.router.navigate(['users', Mode.UPDATE, userKey.uuid]);
  };

  onActivateClick = (evt: Event, userKey: UserKey) => {
    evt.stopPropagation();
    evt.preventDefault();

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
                  value: shiftsSummary,
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

  onRowClick = (userKey: User) => {
    this.router.navigate(['users', Mode.READ, userKey.uuid]);
  };
}
