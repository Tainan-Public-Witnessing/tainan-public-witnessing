import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, first, takeUntil } from 'rxjs/operators';
import { UserKey } from 'src/app/_interfaces/user.interface';
import { UsersService } from 'src/app/_services/users.service';

@Component({
  selector: 'app-member-input',
  templateUrl: './member-input.component.html',
  styleUrls: ['./member-input.component.scss']
})
export class MemberInputComponent implements OnInit, OnDestroy {

  @Input() control!: AbstractControl;

  userKeys: UserKey[] = [];
  autoCompleteUserKeys$ = new BehaviorSubject<string[]>([]);
  destroy$ = new Subject<void>();

  constructor(
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {

    this.usersService.getUserKeys().pipe(
      filter(_userKeys => _userKeys !== null),
      first(),
    ).subscribe(_userKeys => this.userKeys = _userKeys as UserKey[]);

    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (value === '') {
        this.autoCompleteUserKeys$.next([]);
      } else {
        this.autoCompleteUserKeys$.next(
          this.userKeys.filter(userKey => userKey.username.toLowerCase().includes(value.toLowerCase())).map(userKey => userKey.username)
        );
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
