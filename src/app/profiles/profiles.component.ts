import { CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, race, Subject, timer } from 'rxjs';
import { map, switchAll, takeUntil } from 'rxjs/operators';
import { Profile, ProfilePrimarykey } from 'src/app/_interfaces/profile.interface';
import { PermissionService } from 'src/app/_services/permission.service';
import { ConfirmDialogData } from 'src/app/_elements/dialogs/confirm-dialog/confirm-dialog-data.interface';
import { ConfirmDialogComponent } from 'src/app/_elements/dialogs/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CdkDropList) cdkDropList: CdkDropList;

  profilePrimarykeys$ = new BehaviorSubject<ProfilePrimarykey[]>(null);
  exitComponent$ = new Subject<void>();
  unsubscribe$ = new Subject<void>();

  constructor(
    private profileService: PermissionService,
    private matDialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.profileService.profilePrimarykeys$.pipe(takeUntil(this.unsubscribe$)).subscribe(this.profilePrimarykeys$);
    this.profileService.loadProfilePrimarykeys();
    console.log(this.router.url);
  }

  ngAfterViewInit(): void {
    this.subscribeDrop();
    this.subscribeSort();
  }

  ngOnDestroy(): void {
    this.exitComponent$.next();
    this.unsubscribe$.next();
  }

  onAddButtonClick = () => {
    this.router.navigate(['profile', 'create']);
  }

  onEditButtonClick = (profile: Profile) => {
    this.router.navigate(['profile', 'edit', {uuid: profile.uuid}]);
  }

  onDeleteButtonClick = (profile: Profile) => {
    this.matDialog.open(ConfirmDialogComponent, {
      disableClose: true,
      panelClass: 'dialog-panel',
      data: {
        title: 'Delete profile',
        message: 'Are you sure to delete ' + profile.name + '?'
      } as ConfirmDialogData
    }).afterClosed().subscribe(result => {
      if (result) {
        // this.profileService.deleteProfile(profile.uuid);
      }
    });
  }

  private subscribeDrop = (): void => {
    this.cdkDropList.dropped.pipe(takeUntil(this.unsubscribe$)).subscribe(e => {
      const profilePrimarykeys = this.profilePrimarykeys$.getValue();
      moveItemInArray(profilePrimarykeys, e.previousIndex, e.currentIndex);
      this.profilePrimarykeys$.next(profilePrimarykeys);
    });
  }

  private subscribeSort = (): void => {
    this.cdkDropList.sorted.pipe(
      map(() => race(timer(5000), this.exitComponent$)),
      switchAll()
    ).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.profileService.sortProfilePrimarykeys(this.profilePrimarykeys$.getValue());
    });
  }
}
