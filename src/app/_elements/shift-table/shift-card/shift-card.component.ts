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
  destroy$ = new Subject<void>();

  constructor(
    private shiftHoursService: ShiftHoursService,
    private sitesService: SitesService,
    private usersService: UsersService,
    private matDialog: MatDialog,
    private authorityService: AuthorityService,
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
    const n  = new Date(this.shift.date).getDay()
    this.day = environment.DAY[n];

    const shiftEndTime = new Date([this.shift.date, this.shiftHours?.endTime].join(' ')).getTime();
    const shiftEndDate = new Date(this.shift.date);
    shiftEndDate.setDate(shiftEndDate.getDate() + 1);
    const shiftEndDateTime = shiftEndDate.getTime();
    this.canEditStatistic$ = combineLatest([
      this.authorityService.canAccess(Permission.USER, this.shift.crewUuids).pipe(
        map(_canAccess => {
          if (_canAccess) {
            return timer(0, 10000).pipe(
              takeUntil(this.destroy$),
              map(() => {
                const nowTime = new Date().getTime();
                return shiftEndTime < nowTime && nowTime < shiftEndDateTime;
              })
            )
          } else {
            return of(false);
          }
        }),
        switchAll()
      ),
      this.authorityService.canAccess(Permission.MANAGER)
    ]).pipe(
      map(([userAccess, managerAccess]) => {
        return userAccess || managerAccess;
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openStatisticEditor = () => {
    let mode = '';
    if (this.shift.hasStatistic) {
      mode = 'view';
    } else {
      mode = 'create';
    }
    this.matDialog.open(StatisticEditorComponent, {
      disableClose: mode !== 'view',
      panelClass: 'dialog-panel',
      data: {
        mode,
        uuid: this.shift.uuid,
        date: this.shift.date,
      }
    });
  }
}
