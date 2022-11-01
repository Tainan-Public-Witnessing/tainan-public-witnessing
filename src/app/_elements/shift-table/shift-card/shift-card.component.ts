import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, first, map, takeUntil } from 'rxjs/operators';
import { StatisticEditorComponent } from 'src/app/_elements/dialogs/statistic-editor/statistic-editor.component';
import { Permission } from 'src/app/_enums/permission.enum';
import { ShiftHours } from 'src/app/_interfaces/shift-hours.interface';
import { Shift } from 'src/app/_interfaces/shift.interface';
import { Site } from 'src/app/_interfaces/site.interface';
import { UserKey } from 'src/app/_interfaces/user.interface';
import { AuthorityService } from 'src/app/_services/authority.service';
import { ShiftHoursService } from 'src/app/_services/shift-hours.service';
import { SitesService } from 'src/app/_services/sites.service';
import { UsersService } from 'src/app/_services/users.service';
import { environment } from 'src/environments/environment';
import { CrewEditorComponent } from '../../dialogs/crew-editor/crew-editor.component';

@Component({
  selector: 'app-shift-card',
  templateUrl: './shift-card.component.html',
  styleUrls: ['./shift-card.component.scss'],
})
export class ShiftCardComponent implements OnInit, OnDestroy {
  @Input() shift$!: Observable<Shift>;

  emptiness: string[];
  shift: Shift | null = null;
  shiftHours: ShiftHours | null = null;
  site: Site | null = null;
  crew: UserKey[] | null = null;
  day: string | null = null;
  canEditStatistic$!: Observable<boolean>;
  canEditCrew$!: Observable<boolean>;
  changes$ = new Subject<void>();
  managerAccess!: boolean;
  destroy$ = new Subject<void>();

  constructor(
    private shiftHoursService: ShiftHoursService,
    private sitesService: SitesService,
    private usersService: UsersService,
    private matDialog: MatDialog,
    private authorityService: AuthorityService,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.shift$,
      this.shiftHoursService
        .getShiftHoursList()
        .pipe(filter((_shiftHoursList) => _shiftHoursList !== null)),
      this.sitesService.getSites().pipe(filter((_sites) => _sites !== null)),
      this.usersService
        .getUserKeys()
        .pipe(filter((_userKeys) => _userKeys !== null)),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([_shift, _shiftHoursList, _sites, _userKeys]) => {
        this.shift = _shift;
        this.shiftHours = _shiftHoursList?.find(
          (_shiftHours) => _shift.shiftHoursUuid === _shiftHours.uuid
        ) as ShiftHours;
        this.site = _sites?.find(
          (_site) => _shift.siteUuid === _site.uuid
        ) as Site;
        this.crew = _shift.crewUuids.map((_memberUuid) =>
          _userKeys?.find((_userKey) => _userKey.uuid === _memberUuid)
        ) as UserKey[];
        this.day = environment.DAY[new Date(_shift.date).getDay()];

        const attendance = _shift.attendance || 4;
        this.emptiness = new Array(attendance - this.crew.length).fill(0);
      });

    this.pipeCanEditStatistic();
    this.pipeCanEditCrew();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openStatisticEditor = () => {
    if (this.shift) {
      const shiftEndTime = new Date(
        [this.shift.date.replace(/\-/g, '/'), this.shiftHours?.endTime].join(
          ' '
        )
      ).getTime();
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
            },
          });
        } else {
          this.translateService
            .get('SHIFT_CARD.MESSAGE.OVER_TIME')
            .pipe(first())
            .subscribe((_message) => {
              this.matSnackBar.open(_message, undefined, { duration: 3000 });
            });
        }
      } else {
        this.translateService
          .get('SHIFT_CARD.MESSAGE.NOT_YET')
          .pipe(first())
          .subscribe((_message) => {
            this.matSnackBar.open(_message, undefined, { duration: 3000 });
          });
      }
    }
  };

  openCrewEditor = () => {
    if (this.shift !== null) {
      this.matDialog.open(CrewEditorComponent, {
        disableClose: true,
        panelClass: 'dialog-panel',
        data: {
          crew: this.crew,
          shift: this.shift,
        },
      });
    }
  };

  private pipeCanEditCrew = () => {
    this.canEditCrew$ = this.authorityService.canAccess(Permission.MANAGER);
  };

  private pipeCanEditStatistic = () => {
    this.shift$
      .pipe(
        filter((_shift) => !!_shift),
        first()
      )
      .subscribe((_shift) => {
        this.canEditStatistic$ = combineLatest([
          this.authorityService.canAccess(Permission.USER, _shift.crewUuids),
          this.authorityService.canAccess(Permission.MANAGER),
        ]).pipe(
          takeUntil(this.destroy$),
          map(([_userAccess, _managerAccess]) => {
            return _userAccess || _managerAccess;
          })
        );
      });
  };
}
