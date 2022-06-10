import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Subject } from 'rxjs';
import { UsersService } from 'src/app/_services/users.service';
import { UserKey } from 'src/app/_interfaces/user.interface';
import { takeUntil, first, filter, map } from 'rxjs/operators';
import { AuthorityService } from 'src/app/_services/authority.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup;
  userKeys: UserKey[] = [];
  autoCompleteUserKeys$ = new BehaviorSubject<string[]>([]);
  destroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private formBuilder: UntypedFormBuilder,
    private usersService: UsersService,
    private authorityService: AuthorityService,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.usersService.getUserKeys().pipe(
      filter(userKeys => userKeys !== null),
      map(userKeys => userKeys as UserKey[]),
      first(),
    ).subscribe(userKeys => this.userKeys = userKeys);

    this.loginForm.get('username')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
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

  onCancelClick = () => {
    this.dialogRef.close(false);
  }

  onConfirmClick = () => {
    if (this.loginForm.status === 'VALID') {
      const index = this.userKeys.findIndex(userKey => userKey.username === this.loginForm.value.username);
      if (index > -1) {
        this.authorityService.login(
          this.userKeys[index].uuid,
          this.loginForm.value.password
        ).then(() => {
          this.dialogRef.close(true);
        }).catch(reason => {
          this.loginForm.setErrors({ permissionFail: true });
        });
      }  else { // username not exist
        this.loginForm.setErrors({ permissionFail: true });
      }
    } else { // not valid
      this.loginForm.markAllAsTouched();
    }
  }
}
