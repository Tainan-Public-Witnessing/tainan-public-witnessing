import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserKey } from 'src/app/_interfaces/user.interface';

@Component({
  selector: 'app-member-input',
  templateUrl: './member-input.component.html',
  styleUrls: ['./member-input.component.scss']
})
export class MemberInputComponent implements OnInit, OnDestroy {

  @Input() control!: AbstractControl;
  @Input() userKeys!: UserKey[];
  @Input() isGroupLeader!: boolean;

  autoCompleteUserKeys$ = new BehaviorSubject<string[]>([]);
  destroy$ = new Subject<void>();

  constructor() { }

  ngOnInit(): void {

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
