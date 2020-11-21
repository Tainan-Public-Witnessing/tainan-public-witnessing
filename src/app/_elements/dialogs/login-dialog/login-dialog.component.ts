import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { UsersService } from 'src/app/_services/users.service';
import { UserPrimarykey } from 'src/app/_interfaces/user.interface';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  userPrimaryKeys$ = new BehaviorSubject<UserPrimarykey[]>(null);
  usernameAutoComplete$: Observable<UserPrimarykey[]>;
  unsubscribe$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
    this.usersService.getUserPrimarykeys().pipe(takeUntil(this.unsubscribe$)).subscribe(this.userPrimaryKeys$);

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.usernameAutoComplete$ = this.pipeUsernameAutoComplete();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  onCancelClick = () => {
    this.dialogRef.close(null);
  }

  onConfirmClick = () => {

  }

  private pipeUsernameAutoComplete = (): Observable<UserPrimarykey[]> => {
    return combineLatest([
      this.userPrimaryKeys$,
      this.loginForm.controls.username.valueChanges,
    ]).pipe(
      map(data => data[0].filter(userPrimaryKey => userPrimaryKey.username.includes(data[1])))
    );
  }

}
