import { CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, race, Subject, timer } from 'rxjs';
import { map, switchAll, takeUntil } from 'rxjs/operators';
import { Profile, ProfilePrimarykey } from 'src/app/_interfaces/profile.interface';
import { ConfirmDialogData } from 'src/app/_elements/dialogs/confirm-dialog/confirm-dialog-data.interface';
import { ConfirmDialogComponent } from 'src/app/_elements/dialogs/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { ProfilesService } from 'src/app/_services/profiles.service';
import { Mode } from 'src/app/_enums/mode.enum';
import { AuthorityService } from 'src/app/_services/authority.service';
import { PermissionKey } from 'src/app/_enums/permission-key.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CdkDropList) cdkDropList: CdkDropList;

  profilePrimarykeys$ = new BehaviorSubject<ProfilePrimarykey[]>(null);
  profilesSortAccess$: Observable<boolean>;
  profileReadAccess$: Observable<boolean>;
  profileCreateAccess$: Observable<boolean>;
  profileUpdateAccess$: Observable<boolean>;
  profileDeleteAccess$: Observable<boolean>;
  exitComponent$ = new Subject<void>();
  unsubscribe$ = new Subject<void>();

  constructor(
    private authorityService: AuthorityService,
    public profilesService: ProfilesService,
    private translateService: TranslateService,
    private matDialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.profilesService.getProfilePrimarykeys().pipe(takeUntil(this.unsubscribe$)).subscribe(this.profilePrimarykeys$);

    this.profilesSortAccess$ = this.authorityService.getPermissionByKey(PermissionKey.PROFILES_SORT);
    this.profileReadAccess$ = this.authorityService.getPermissionByKey(PermissionKey.PROFILE_READ);
    this.profileCreateAccess$ = this.authorityService.getPermissionByKey(PermissionKey.PROFILE_CREATE);
    this.profileUpdateAccess$ = this.authorityService.getPermissionByKey(PermissionKey.PROFILE_UPDATE);
    this.profileDeleteAccess$ = this.authorityService.getPermissionByKey(PermissionKey.PROFILE_DELETE);
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
    this.router.navigate(['profile', Mode.CREATE]);
  }

  onEditButtonClick = (profile: Profile) => {
    this.router.navigate(['profile', Mode.UPDATE, {uuid: profile.uuid}]);
  }

  onInfoButtonClick = (profile: Profile) => {
    this.router.navigate(['profile', Mode.READ, {uuid: profile.uuid}]);
  }

  onDeleteButtonClick = (profile: Profile) => {
    this.matDialog.open(ConfirmDialogComponent, {
      disableClose: true,
      panelClass: 'dialog-panel',
      data: {
        title: 'PROFILES.DELETE_TITLE',
        message: this.translateService.instant('GLOBAL.DELETE_MESSAGE', {value: profile.name})
      } as ConfirmDialogData
    }).afterClosed().subscribe(result => {
      if (result) {
        this.profilesService.deleteProfile(profile.uuid);
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
      this.profilesService.sortProfilePrimarykeys(this.profilePrimarykeys$.getValue());
    });
  }
}
