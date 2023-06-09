import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  first,
  map,
  takeUntil,
} from 'rxjs/operators';
import { EXISTED_ERROR } from 'src/app/_classes/errors/EXISTED_ERROR';
import { FULL_SHIFT_ERROR } from 'src/app/_classes/errors/FULL_SHIFT_ERROR';
import { TOO_MANY_SHIFTS_ERROR } from 'src/app/_classes/errors/TOO_MANY_SHIFTS_ERROR';
import { StatisticEditorComponent } from 'src/app/_elements/dialogs/statistic-editor/statistic-editor.component';
import { Permission } from 'src/app/_enums/permission.enum';
import { ShiftHour } from 'src/app/_interfaces/shift-hours.interface';
import { Shift } from 'src/app/_interfaces/shift.interface';
import { Site } from 'src/app/_interfaces/site.interface';
import { UserKey } from 'src/app/_interfaces/user.interface';
import { AuthorityService } from 'src/app/_services/authority.service';
import {
  EVENTS,
  GlobalEventService,
} from 'src/app/_services/global-event.service';
import { ShiftHoursService } from 'src/app/_services/shift-hours.service';
import { ShiftsService } from 'src/app/_services/shifts.service';
import { SitesService } from 'src/app/_services/sites.service';
import { UsersService } from 'src/app/_services/users.service';
import { environment } from 'src/environments/environment';
import { ConfirmDialogData } from '../../dialogs/confirm-dialog/confirm-dialog-data.interface';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';
import { CrewEditorComponent } from '../../dialogs/crew-editor/crew-editor.component';

@Component({
  selector: 'app-shift-card',
  templateUrl: './shift-card.component.html',
  styleUrls: ['./shift-card.component.scss'],
})
export class ShiftCardComponent implements OnInit, OnDestroy {
  @Input() shift$!: Observable<Shift>;
  @Input() showEmpty: boolean = false;
  @Input() enableDelete: boolean = false;

  emptiness: string[];
  shift: Shift | null = null;
  shiftHour: ShiftHour | null = null;
  activateControl = new FormControl(true);
  site: Site | null = null;
  crew: UserKey[] | null = null;
  day: string | null = null;
  canEditStatistic$!: Observable<boolean>;
  canEditCrew$!: Observable<boolean>;
  managerAccess!: boolean;
  changes$ = new Subject<void>();
  destroy$ = new Subject<void>();

  constructor(
    private shiftService: ShiftsService,
    private shiftHoursService: ShiftHoursService,
    private sitesService: SitesService,
    private usersService: UsersService,
    private matDialog: MatDialog,
    private authorityService: AuthorityService,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
    private globalEvent: GlobalEventService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.shift$,
      this.shiftHoursService
        .getShiftHours()
        .pipe(filter((_shiftHoursList) => _shiftHoursList !== null)),
      this.sitesService.getSites().pipe(filter((_sites) => _sites !== null)),
      this.usersService
        .getUserKeys()
        .pipe(filter((_userKeys) => _userKeys !== null)),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([_shift, _shiftHoursList, _sites, _userKeys]) => {
        this.shift = _shift;
        this.activateControl.setValue(this.shift.activate, {
          emitEvent: false,
        });
        this.shiftHour = _shiftHoursList?.find(
          (_shiftHours) => _shift.shiftHoursUuid === _shiftHours.uuid
        ) as ShiftHour;
        this.site = _sites?.find(
          (_site) => _shift.siteUuid === _site.uuid
        ) as Site;
        this.crew = _shift.crewUuids.map((_memberUuid) =>
          _userKeys?.find((_userKey) => _userKey.uuid === _memberUuid)
        ) as UserKey[];
        this.day = environment.DAY[new Date(_shift.date).getDay()];

        const attendance = _shift.attendance;
        this.emptiness = new Array(attendance - this.crew.length).fill(0);
      });

    this.pipeCanEditStatistic();
    this.pipeCanEditCrew();
    this.authorityService
      .canAccess(Permission.MANAGER)
      .pipe(takeUntil(this.destroy$))
      .subscribe((_managerAccess) => (this.managerAccess = _managerAccess));

    this.activateControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((_isActivate) => {
        if (!!this.shift && _isActivate !== null) {
          this.shift.activate = _isActivate;
          this.shiftService.updateShift(this.shift);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openStatisticEditor = () => {
    if (!this.shift) {
      return;
    }

    const shiftEndTime = new Date(
      [this.shift.date.replace(/\-/g, '/'), this.shiftHour?.endTime].join(' ')
    ).getTime();
    const shiftEndDate = new Date(this.shift.date);
    shiftEndDate.setDate(shiftEndDate.getDate() + 1);
    const shiftEndDateTime = shiftEndDate.getTime();
    const nowTime = new Date().getTime();

    if (shiftEndTime >= nowTime && !this.managerAccess) {
      this.translateService
        .get('SHIFT_CARD.MESSAGE.NOT_YET')
        .pipe(first())
        .subscribe((_message) => {
          this.matSnackBar.open(_message, undefined, { duration: 3000 });
        });
      return;
    }

    if (nowTime >= shiftEndDateTime && !this.managerAccess) {
      this.translateService
        .get('SHIFT_CARD.MESSAGE.OVER_TIME')
        .pipe(first())
        .subscribe((_message) => {
          this.matSnackBar.open(_message, undefined, { duration: 3000 });
        });
      return;
    }

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

  onEmptySpotClick = () => {
    if (this.shift) {
      this.matDialog
        .open(ConfirmDialogComponent, {
          data: {
            title: 'AVAILABLE_SHIFTS.JOIN_CONFIRM_TITLE',
            message: 'AVAILABLE_SHIFTS.JOIN_CONFIRM_MESSAGE',
            messageParams: {
              date: this.shift.date,
              time: `${this.shiftHour?.startTime} ~ ${this.shiftHour?.endTime}`,
              site: this.site?.name,
            },
          } as ConfirmDialogData,
        })
        .afterClosed()
        .subscribe(async (result) => {
          if (result) {
            try {
              await this.shiftService.joinShift(
                this.shift!,
                this.authorityService.currentUserUuid$.value!
              );
              this.globalEvent.emitGlobalEvent({ id: EVENTS.SHIFTS_CHANGE });

              this.matSnackBar.open(
                this.translateService.instant(
                  'AVAILABLE_SHIFTS.JOIN_SUCCESSFULLY'
                )
              );
            } catch (ex) {
              let message = '';

              if (ex instanceof TOO_MANY_SHIFTS_ERROR) {
                message = 'TOO_MANY_SHIFTS_ERROR';
              } else if (ex instanceof EXISTED_ERROR) {
                message = 'EXISTED_ERROR';
              } else if (ex instanceof FULL_SHIFT_ERROR) {
                message = 'FULL_SHIFT_ERROR';
              } else {
                message = 'JOIN_FAILED';
              }
              this.matDialog.open(ConfirmDialogComponent, {
                data: {
                  title: 'AVAILABLE_SHIFTS.JOIN_FAILED',
                  message: `AVAILABLE_SHIFTS.${message}`,
                  hideCancelButton: true,
                } as ConfirmDialogData,
              });
            }
          }
        });
    }
  };

  onDelete() {
    this.matDialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'SHIFTS.DELETE_CONFIRM_TITLE',
          message: 'SHIFTS.DELETE_CONFIRM_MESSAGE',
          messageParams: {
            date: this.shift?.date,
            time: this.shiftHour?.name,
            site: this.site?.name,
          },
        } as ConfirmDialogData,
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.shiftService.deleteShift(this.shift!);
          this.globalEvent.emitGlobalEvent({ id: EVENTS.SHIFTS_CHANGE });
        }
      });
  }

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
