import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UsersService } from 'src/app/_services/users.service';
import { UserPrimarykey } from 'src/app/_interfaces/user.interface';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Mode } from 'src/app/_enums/mode.enum';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/_elements/dialogs/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogData } from 'src/app/_elements/dialogs/confirm-dialog/confirm-dialog-data.interface';
import { AuthorityService } from 'src/app/_services/authority.service';
import { Permission } from 'src/app/_interfaces/profile.interface';
import { PermissionKey } from '../_enums/permission-key.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  userPrimarykeys$ = new BehaviorSubject<UserPrimarykey[]>(null);
  userCreateAccess$: Observable<boolean>;
  userUpdateAccess$: Observable<boolean>;
  userDeleteAccess$: Observable<boolean>;
  userReadAccess$: Observable<boolean>;
  unsubscribe$ = new Subject();

  constructor(
    private authorityService: AuthorityService,
    private translateService: TranslateService,
    private router: Router,
    private usersService: UsersService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.usersService.getUserPrimarykeys().pipe(takeUntil(this.unsubscribe$)).subscribe(this.userPrimarykeys$);

    this.userCreateAccess$ = this.authorityService.getPermissionByKey(PermissionKey.USER_CREATE);
    this.userUpdateAccess$ = this.authorityService.getPermissionByKey(PermissionKey.USER_UPDATE);
    this.userDeleteAccess$ = this.authorityService.getPermissionByKey(PermissionKey.USER_DELETE);
    this.userReadAccess$ = this.authorityService.getPermissionByKey(PermissionKey.USER_READ);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  onAddButtonClick = () => {
    this.router.navigate(['user', Mode.CREATE]);
  }

  onEditButtonClick = (userPrimarykey: UserPrimarykey) => {
    this.router.navigate(['user', Mode.UPDATE, {uuid: userPrimarykey.uuid}]);
  }

  onInfoButtonClick = (userPrimarykey: UserPrimarykey) => {
    this.router.navigate(['user', Mode.READ, {uuid: userPrimarykey.uuid}]);
  }

  onDeleteButtonClick = (userPrimarykey: UserPrimarykey) => {
    this.matDialog.open(ConfirmDialogComponent, {
      disableClose: true,
      panelClass: 'dialog-panel',
      data: {
        title: 'USERS.DELETE_TITLE',
        message: this.translateService.instant('GLOBAL.DELETE_MESSAGE', {value: userPrimarykey.username})
      } as ConfirmDialogData
    }).afterClosed().subscribe(result => {
      if (result) {
        this.usersService.deleteUser(userPrimarykey.uuid);
      }
    });
  }
}
