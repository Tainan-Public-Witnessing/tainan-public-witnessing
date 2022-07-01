import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, filter, first, Observable, of, Subject, timer } from 'rxjs';
import { map, switchAll, takeUntil } from 'rxjs/operators';
import { ShiftHours } from 'src/app/_interfaces/shift-hours.interface';
import { Shift } from 'src/app/_interfaces/shift.interface';
import { Site } from 'src/app/_interfaces/site.interface';
import { UserKey } from 'src/app/_interfaces/user.interface';
import { ShiftHoursService } from 'src/app/_services/shift-hours.service';
import { SitesService } from 'src/app/_services/sites.service';
import { UsersService } from 'src/app/_services/users.service';
import { environment } from 'src/environments/environment';
import { StatisticEditorComponent } from 'src/app/_elements/dialogs/statistic-editor/statistic-editor.component';
import { AuthorityService } from 'src/app/_services/authority.service';
import { Permission } from 'src/app/_enums/permission.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-shift-card',
  templateUrl: './shift-card.component.html',
  styleUrls: ['./shift-card.component.scss']
})
export class ShiftCardComponent implements OnInit, OnDestroy {

  @Input() shift!: Shift;

  shiftHours: ShiftHours|null = null;
  site: Site|null = null;
  crew: UserKey[] = [];
  day: string|null = null;
  canEditStatistic$!: Observable<boolean>;
  managerAccess!: boolean;
  destroy$ = new Subject<void>();

  constructor(
    private shiftHoursService: ShiftHoursService,
    private sitesService: SitesService,
    private usersService: UsersService,
    private matDialog: MatDialog,
    private authorityService: AuthorityService,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.shiftHoursService.getShiftHoursList().pipe(
      filter(shiftHoursList => shiftHoursList !== null),
      map(shiftHoursList => shiftHoursList as ShiftHours[]),
      first()
    ).subscribe(shiftHoursList => {
      this.shiftHours = shiftHoursList.find(_shiftHours => this.shift.shiftHoursUuid === _shiftHours.uuid) as ShiftHours;
    });
    this.sitesService.getSites().pipe(
      filter(sites => sites !== null),
      map(sites => sites as Site[]),
      first()
    ).subscribe(sites => {
      this.site = sites.find(_site => this.shift.siteUuid === _site.uuid) as Site;
    });
    this.usersService.getUserKeys().pipe(
      filter(userKeys => userKeys !== null),
      map(userKeys => userKeys as UserKey[]),
      first()
    ).subscribe(userKeys => {
      this.crew = this.shift.crewUuids.map(_uuid => userKeys.find(_userKey => _userKey.uuid === _uuid) as UserKey);
    });
    const n = new Date(this.shift.date).getDay()
    this.day = environment.DAY[n];

    this.canEditStatistic$ = combineLatest([
      this.authorityService.canAccess(Permission.USER, this.shift.crewUuids),
      this.authorityService.canAccess(Permission.MANAGER),
    ]).pipe(
      takeUntil(this.destroy$),
      map(([_userAccess, _managerAccess]) => {
        return _userAccess || _managerAccess;
      })
    );

    this.authorityService.canAccess(Permission.MANAGER).pipe(takeUntil(this.destroy$)).subscribe(_access => this.managerAccess = _access);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openStatisticEditor = () => {
    const shiftEndTime = new Date([this.shift.date.replace(/\-/g, "/"), this.shiftHours?.endTime].join(' ')).getTime();
    const shiftEndDate = new Date(this.shift.date);
    shiftEndDate.setDate(shiftEndDate.getDate() + 1);
    const shiftEndDateTime = shiftEndDate.getTime();
    const nowTime = new Date().getTime();

    if (this.managerAccess || shiftEndTime < nowTime) {
      if (this.managerAccess || nowTime < shiftEndDateTime) {
        const mode = this.shift.hasStatistic ? 'view' : 'create';
        this.matDialog.open(StatisticEditorComponent, {
          disableClose: mode !== 'view',
          panelClass: 'dialog-panel',
          data: {
            mode,
            uuid: this.shift.uuid,
            date: this.shift.date,
          }
        });
      }else {
        this.translateService.get('SHIFT_CARD.MESSAGE.OVER_TIME').pipe(first()).subscribe(_message => {
          this.matSnackBar.open(_message, undefined, { duration: 3000 });
        });
      }
    } else {
      this.translateService.get('SHIFT_CARD.MESSAGE.NOT_YET').pipe(first()).subscribe(_message => {
        this.matSnackBar.open(_message, undefined, { duration: 3000 });
      });
    }
  }
}
