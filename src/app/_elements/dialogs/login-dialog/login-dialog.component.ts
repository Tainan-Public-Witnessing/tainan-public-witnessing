import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { combineLatest, Observable, Subject } from 'rxjs';
import { UsersService } from 'src/app/_services/users.service';
import { UserKey } from 'src/app/_interfaces/user.interface';
import { map, takeUntil, first, filter } from 'rxjs/operators';
import { AuthorityService } from 'src/app/_services/authority.service';
import { Status } from 'src/app/_enums/status.enum';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  userKeys: UserKey[];
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

    this.usersService.getUserKeys().pipe(filter(userKeys => !!userKeys), first()).subscribe(userKeys => this.userKeys = userKeys);
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
          if (reason === 'NOT_EXIST_OR_WRONG_PASSWORD') {
            this.loginForm.setErrors({ permissionFail: true });
          }
        });
      }  else { // username not exist
        this.loginForm.controls.username.setErrors({ notExist: true });
      }
    } else { // not valid
      this.loginForm.markAllAsTouched();
    }
  }
}
