import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { UsersService } from 'src/app/_services/users.service';
import { UserPrimarykey } from 'src/app/_interfaces/user.interface';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  userPrimarykeys$ = new BehaviorSubject<UserPrimarykey[]>(null);
  unsubscribe$ = new Subject();

  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.usersService.getUserPrimarykeys().pipe(takeUntil(this.unsubscribe$)).subscribe(this.userPrimarykeys$);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  onAddButtonClick = () => {
    // this.router.navigate(['profile', Mode.CREATE]);
  }

  onEditButtonClick = (userPrimarykey: UserPrimarykey) => {
    // this.router.navigate(['profile', Mode.UPDATE, {uuid: profile.uuid}]);
  }

  onInfoButtonClick = (userPrimarykey: UserPrimarykey) => {
    // this.router.navigate(['profile', Mode.READ, {uuid: profile.uuid}]);
  }

  onDeleteButtonClick = (userPrimarykey: UserPrimarykey) => {
    // this.matDialog.open(ConfirmDialogComponent, {
    //   disableClose: true,
    //   panelClass: 'dialog-panel',
    //   data: {
    //     title: 'Delete profile',
    //     message: 'Are you sure to delete ' + profile.name + '?'
    //   } as ConfirmDialogData
    // }).afterClosed().subscribe(result => {
    //   if (result) {
    //     this.profilesService.deleteProfile(profile.uuid);
    //   }
    // });
  }
}
