import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { UsersService } from 'src/app/_services/users.service';
import { UserPrimarykey } from 'src/app/_interfaces/user.interface';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Mode } from 'src/app/_enums/mode.enum';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/_elements/dialogs/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogData } from 'src/app/_elements/dialogs/confirm-dialog/confirm-dialog-data.interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  userPrimarykeys$ = new BehaviorSubject<UserPrimarykey[]>(null);
  unsubscribe$ = new Subject();

  constructor(
    private router: Router,
    private usersService: UsersService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.usersService.getUserPrimarykeys().pipe(takeUntil(this.unsubscribe$)).subscribe(this.userPrimarykeys$);
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
        title: 'Delete profile',
        message: 'Are you sure to delete ' + userPrimarykey.username + '?'
      } as ConfirmDialogData
    }).afterClosed().subscribe(result => {
      if (result) {
        this.usersService.deleteUser(userPrimarykey.uuid);
      }
    });
  }
}
