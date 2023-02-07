import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, forkJoin, Observable, of } from 'rxjs';
import {
  debounceTime,
  filter,
  first,
  map,
  startWith,
  switchAll,
  tap
} from 'rxjs/operators';
import { Permission } from '../_enums/permission.enum';
import { Shift } from '../_interfaces/shift.interface';
import { AuthorityService } from '../_services/authority.service';
import { PersonalShiftsService } from '../_services/personal-shifts.service';
import { ShiftsService } from '../_services/shifts.service';
import { UsersService } from '../_services/users.service';
import { UserKey } from './../_interfaces/user.interface';

@Component({
  selector: 'app-personal-shift',
  templateUrl: './personal-shift.component.html',
  styleUrls: ['./personal-shift.component.scss'],
})
export class PersonalShiftComponent implements OnInit {
  yearMonthControl = new FormControl<string>(
    new Date().toJSON().substring(0, 7)
  );
  userFilter = new FormControl<string | UserKey | null>('');
  selectedUserUuid = new BehaviorSubject<string>(
    this.authorityService.currentUserUuid$.value!
  );
  allUsers = new BehaviorSubject<UserKey[] | null>([]);
  filteredUsers = new BehaviorSubject<UserKey[]>([]);
  shifts$!: Observable<Shift[] | null | undefined>;
  requireManager$ = new BehaviorSubject<boolean>(false);


  constructor(
    private authorityService: AuthorityService,
    private personalShiftsService: PersonalShiftsService,
    private shiftsService: ShiftsService,
    public userService: UsersService
  ) {}

  ngOnInit(): void {
    this.authorityService
      .canAccess(Permission.MANAGER)
      .subscribe(this.requireManager$);

    let firstLoad = true;
    this.userService
      .getUserKeys()
      .pipe(
        map((users) => users?.filter((u) => u.activate) || null),
        tap((users) => {
          if (!users) return;
          if (firstLoad) {
            firstLoad = false;
            this.userFilter.setValue(
              users.find(
                (u) => u.uuid === this.authorityService.currentUserUuid$.value
              ) ?? null
            );
          }
        })
      )
      .subscribe(this.allUsers);

    combineLatest([
      this.allUsers.pipe(startWith(this.allUsers.value)),
      this.userFilter.valueChanges.pipe(
        startWith(this.userFilter.value),
        debounceTime(100)
      ),
    ])
      .pipe(
        map(([users, filter]) => {
          if (!users) return [];
          if (!filter) return users;

          const regex = new RegExp(
            typeof filter === 'string' ? filter : filter.username,
            'i'
          );
          return users.filter((user) => regex.test(user.username));
        })
      )
      .subscribe(this.filteredUsers);

    this.shifts$ = combineLatest([
      this.yearMonthControl.valueChanges.pipe(
        startWith(this.yearMonthControl.value),
        filter((v) => !!v)
      ),
      this.selectedUserUuid.pipe(startWith(this.selectedUserUuid.value)),
    ]).pipe(
      map(([ym, user]) =>
        this.personalShiftsService.getPersonalShifts(ym!, user)
      ),
      switchAll(),
      filter((_personalShift) => _personalShift !== null),
      map((_personalShift) => {
        if (!!_personalShift) {
          const _yearMonth = this.yearMonthControl.value as string;
          const _shiftUuids = _personalShift?.shiftUuids as string[];
          if (_shiftUuids.length === 0) return undefined;
          return this.shiftsService.getShiftsByUuids(_yearMonth, _shiftUuids);
        } else {
          return undefined;
        }
      }),
      map((_shift$s) => {
        if (_shift$s !== undefined) {
          return forkJoin(
            _shift$s.map((_shift$) =>
              _shift$.pipe(
                filter((_shift) => !!_shift),
                first()
              )
            ) as Observable<Shift>[]
          );
        } else {
          return of(undefined);
        }
      }),
      switchAll()
    );
  }

  displayFn(user: UserKey) {
    return user?.username;
  }

  onOptionSelected(user: UserKey) {
    this.selectedUserUuid.next(user.uuid);
  }
}
