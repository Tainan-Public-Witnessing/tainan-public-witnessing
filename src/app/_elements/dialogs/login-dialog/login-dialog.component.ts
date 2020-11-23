import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { UsersService } from 'src/app/_services/users.service';
import { UserPrimarykey } from 'src/app/_interfaces/user.interface';
import { map, takeUntil } from 'rxjs/operators';
import { AuthorityService } from 'src/app/_services/authority.service';
import { Status } from 'src/app/_enums/status.enum';

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
    private authorityService: AuthorityService,
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
    if (this.loginForm.status === 'VALID') {

      const uuid = this.userPrimaryKeys$.getValue().find(userPrimaryKey => {
        return userPrimaryKey.username === this.loginForm.value.username;
      })?.uuid;

      if (uuid) {
        this.authorityService.login(
          uuid,
          this.loginForm.value.password
        ).then(() => {
          this.dialogRef.close(null);
        }).catch(reason => {
          if (reason === Status.WRONG_PASSWORD) {
            this.loginForm.controls.password.setErrors({
              wrongPassword: true
            });
          } else {
            console.log('reason', reason);
          }
        });
      } else { // username not exist
        this.loginForm.controls.username.setErrors({
          notExist: true
        });
      }
    } else { // not valid
      this.loginForm.markAllAsTouched();
    }
  }

  private pipeUsernameAutoComplete = (): Observable<UserPrimarykey[]> => {
    return combineLatest([
      this.userPrimaryKeys$,
      this.loginForm.controls.username.valueChanges,
    ]).pipe(
      map(data => data[0].filter(userPrimaryKey => userPrimaryKey.username.toLowerCase().includes(data[1].toLowerCase())))
    );
  }

}
