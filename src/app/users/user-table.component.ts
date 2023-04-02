import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { BehaviorSubject, combineLatest, map, Subject } from 'rxjs';
import { startWith, switchMap, take } from 'rxjs/operators';
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
export class UserTableComponent implements OnInit, AfterViewInit {
  @AutoUnsubscribe()
  reloadList$ = new Subject<void>();

  @AutoUnsubscribe()
  users$ = new BehaviorSubject<User[] | null>(null);

  filterValue: FormGroup;

  @AutoUnsubscribe()
  displayingUsers$ = new BehaviorSubject<User[]>([]);
  tableDataSource = new MatTableDataSource<User>();

  @AutoUnsubscribe()
  userCreateAccess$ = new BehaviorSubject<boolean>(false);
  @AutoUnsubscribe()
  userUpdateAccess$ = new BehaviorSubject<boolean>(false);
  @AutoUnsubscribe()
  userDeleteAccess$ = new BehaviorSubject<boolean>(false);

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

  showFilter = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private authorityService: AuthorityService,
    // private translateService: TranslateService,
    private router: Router,
    private matDialog: MatDialog,
    private usersService: UsersService,
    private congregationService: CongregationsService,
    formBuilder: FormBuilder
  ) {
    this.filterValue = formBuilder.group({
      username: [''],
      name: [''],
      gender: [[]],
      congregationUuid: [[]],
      cellphone: [''],
      phone: [''],
      permission: [[]],
      activated: [null as boolean | null],
    });
  }

  ngOnInit(): void {
    combineLatest([
      this.reloadList$.pipe(
        startWith(undefined),
        switchMap(() => this.usersService.getAllUsers())
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
      this.filterValue.valueChanges.pipe(startWith(this.filterValue.value)),
    ]).subscribe(([users, congregations, filterValue]) => {
      const filteredUsers = users?.filter(this.filterUser(filterValue));
      const mappedUsers = filteredUsers?.map((user) => ({
        ...user,
        congregationUuid: congregations[user.congregationUuid],
      }));
      this.users$.next(mappedUsers || []);
    });

    this.users$.subscribe((users) => (this.tableDataSource.data = users || []));

    const admin = this.authorityService.canAccess(Permission.ADMINISTRATOR);
    admin.subscribe(this.userCreateAccess$);
    admin.subscribe(this.userUpdateAccess$);
    admin.subscribe(this.userDeleteAccess$);
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

  filterUser = (filterValue: any) => (user: User) => {
    console.log(user);
    if (filterValue.username && !user.username.includes(filterValue.username)) {
      return false;
    }

    if (filterValue.name) {
      try {
        const regex = new RegExp(filterValue.name, 'i');
        if (!regex.test(user.name)) {
          return false;
        }
      } catch (ex) {
        // fallback if input is not valid regexp expression
        if (!user.name.includes(filterValue.name)) {
          return false;
        }
      }
    }

    if (
      filterValue.gender.length &&
      !filterValue.gender.includes(user.gender)
    ) {
      return false;
    }

    if (
      filterValue.congregationUuid.length &&
      !filterValue.congregationUuid.includes(user.congregationUuid)
    ) {
      return false;
    }

    if (
      filterValue.permission.length &&
      !filterValue.permission.includes(user.permission)
    ) {
      return false;
    }

    console.log(filterValue.cellphone, user.cellphone);
    if (
      filterValue.cellphone &&
      !user.cellphone?.includes(filterValue.cellphone)
    ) {
      return false;
    }

    if (filterValue.phone && !user.phone?.includes(filterValue.phone)) {
      return false;
    }

    return true;
  };
}
