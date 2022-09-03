import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Mode } from 'src/app/_enums/mode.enum';
import { UserKey } from 'src/app/_interfaces/user.interface';
import { AuthorityService } from 'src/app/_services/authority.service';
import { UsersService } from 'src/app/_services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  userPrimarykeys$ = new BehaviorSubject<UserKey[] | null>(null);
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
      this.usersService.getUserKeys().pipe(takeUntil(this.unsubscribe$)),
      this.filterValue$.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      ),
    ]).subscribe(([users, filter]) => {
      if (!users) return [];

      const filterReg = new RegExp(filter, 'i');
      this.userPrimarykeys$.next(
        users.filter((user) => filterReg.test(user.username))
      );
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // onAddButtonClick = () => {
  //   this.router.navigate(["user", Mode.CREATE]);
  // };

  onInfoButtonClick = (userKey: UserKey) => {
    this.router.navigate(['user', Mode.READ, { uuid: userKey.uuid }]);
  };
}
