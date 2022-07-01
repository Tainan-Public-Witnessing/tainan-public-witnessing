import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, Observable, of, Subject, timer } from 'rxjs';
import { filter, map, switchAll, takeUntil } from 'rxjs/operators';
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
import { CrewEditorComponent } from '../../dialogs/crew-editor/crew-editor.component';

@Component({
  selector: 'app-shift-card',
  templateUrl: './shift-card.component.html',
  styleUrls: ['./shift-card.component.scss']
})
export class ShiftCardComponent implements OnInit, OnDestroy {

  @Input() shift$!: Observable<Shift>;

  shift: Shift|null = null;
  shiftHours: ShiftHours|null = null;
  site: Site|null = null;
  crew: UserKey[]|null = null;
  day: string|null = null;
  canEditStatistic$!: Observable<boolean>;
  canEditCrew$!: Observable<boolean>;
  changes$ = new Subject<void>();
  destroy$ = new Subject<void>();

  constructor(
    private shiftHoursService: ShiftHoursService,
    private sitesService: SitesService,
    private usersService: UsersService,
    private matDialog: MatDialog,
    private authorityService: AuthorityService,
  ) { }

  ngOnInit(): void {

    combineLatest([
      this.shift$,
      this.shiftHoursService.getShiftHoursList().pipe(filter(_shiftHoursList => _shiftHoursList !== null)),
      this.sitesService.getSites().pipe(filter(_sites => _sites !== null)),
      this.usersService.getUserKeys().pipe(filter(_userKeys => _userKeys !== null)),
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([_shift, _shiftHoursList, _sites, _userKeys]) => {
      this.shift = _shift;
      this.shiftHours = _shiftHoursList?.find(_shiftHours => _shift.shiftHoursUuid === _shiftHours.uuid) as ShiftHours;
      this.site = _sites?.find(_site => _shift.siteUuid === _site.uuid) as Site;
      this.crew = _shift.crewUuids.map(_memberUuid => _userKeys?.find(_userKey => _userKey.uuid === _memberUuid)) as UserKey[];
      this.day = environment.DAY[new Date(_shift.date).getDay()];
    });

    this.pipeCanEditStatistic();
    this.pipeCanEditCrew();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openStatisticEditor = () => {
    if (this.shift !== null) {
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

  openCrewEditor = () => {
    if (this.shift !== null) {
      this.matDialog.open(CrewEditorComponent, {
        disableClose: true,
        panelClass: 'dialog-panel',
        data: {
          crew: this.crew,
          shift: this.shift,
        }
      });
    }
  }

  private pipeCanEditStatistic = () => {
    this.shift$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(_shift => {
      const shiftEndTime = new Date([_shift.date.replace(/\-/g, '/'), this.shiftHours?.endTime].join(' ')).getTime();
      const shiftEndDate = new Date(_shift.date);
      shiftEndDate.setDate(shiftEndDate.getDate() + 1);
      const shiftEndDateTime = shiftEndDate.getTime();
      this.canEditStatistic$ = combineLatest([
        this.authorityService.canAccess(Permission.USER, _shift.crewUuids).pipe(
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
    });
  }

  private pipeCanEditCrew = () => {
    this.canEditCrew$ = this.authorityService.canAccess(Permission.MANAGER);
  }
}
