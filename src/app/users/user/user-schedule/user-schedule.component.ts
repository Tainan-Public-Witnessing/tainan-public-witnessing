import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import {
  BehaviorSubject,
  combineLatest,
  combineLatestAll,
  filter,
  firstValueFrom,
  map,
  Subject,
  takeUntil,
} from 'rxjs';
import { Permission } from 'src/app/_enums/permission.enum';
import { ShiftHour } from 'src/app/_interfaces/shift-hours.interface';
import {
  UserSchedule,
  UserScheduleDayData,
} from 'src/app/_interfaces/user-schedule.interface';
import { UserKey } from 'src/app/_interfaces/user.interface';
import { AuthorityService } from 'src/app/_services/authority.service';
import { ShiftHoursService } from 'src/app/_services/shift-hours.service';
import { SiteShiftService } from 'src/app/_services/site-shifts.service';
import { UserScheduleService } from 'src/app/_services/user-schedule.service';
import { UsersService } from 'src/app/_services/users.service';
import { environment } from 'src/environments/environment';
import { CalendarHeaderComponent } from './calendar-header/calendar-header.component';

@Component({
  selector: 'app-user-schedule',
  templateUrl: './user-schedule.component.html',
  styleUrls: ['./user-schedule.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserScheduleComponent implements OnInit, OnDestroy, OnChanges {
  @Input() title: string;
  @Input() uuid: string;
  @Input() disabled: boolean;

  unsubscribe$ = new Subject<void>();
  requireAdmin$ = new BehaviorSubject<boolean>(false);

  shiftHours: ShiftHour[];
  validationErrors?: {
    [field in keyof UserScheduleComponent['schedulingConfig']]?: string;
  };
  schedulingConfig = {
    availableHours: new Array(7).fill({}) as UserScheduleDayData[],
    unavailableDates: [] as string[],
    partnerUuid: '',
    assign: true,
    lineToken: '',
  };

  userKeys$ = new BehaviorSubject<UserKey[]>([]);
  partnerInput$ = new BehaviorSubject<string>('');
  partnerOptions$ = new BehaviorSubject<UserKey[]>([]);
  isXsScreen$ = new BehaviorSubject<boolean>(false);
  schedulingRange = this.getNextSchedulingRange();
  calendarHeader = CalendarHeaderComponent;

  subscribe: boolean;

  constructor(
    private siteShiftsService: SiteShiftService,
    private shiftHoursService: ShiftHoursService,
    private authorityService: AuthorityService,
    private userScheduleService: UserScheduleService,
    private userService: UsersService,
    private translateService: TranslateService,
    private breakPointObserver: BreakpointObserver,
    private snackBar: MatSnackBar
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.uuid.currentValue) {
      this.loadEditingData(this.uuid);
    }
  }

  ngOnInit() {
    this.authorityService
      .canAccess(Permission.ADMINISTRATOR)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(this.requireAdmin$);

    this.userService
      .getUserKeys()
      .pipe(
        takeUntil(this.unsubscribe$),
        map((data) => data || [])
      )
      .subscribe(this.userKeys$);

    const targetSize = Breakpoints.XSmall;
    this.breakPointObserver
      .observe(targetSize)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((state) => this.isXsScreen$.next(state.matches));

    combineLatest([
      this.userKeys$.pipe(
        takeUntil(this.unsubscribe$),
        map((users) =>
          users.sort((a, b) => a.username.localeCompare(b.username))
        )
      ),
      this.partnerInput$.pipe(takeUntil(this.unsubscribe$)),
    ])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([users, filter]) => {
        const filterReg = new RegExp(filter, 'i');
        this.partnerOptions$.next(
          users.filter((user) => filterReg.test(user.username))
        );
      });

    this.partnerInput$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((input) => (this.schedulingConfig.partnerUuid = input));
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  showSelectedDate = (date: Moment) => {
    if (
      this.schedulingConfig.unavailableDates.find((d) => date.isSame(d, 'day'))
    )
      return 'selected';
    return '';
  };

  getNextSchedulingRange() {
    const start = moment();
    start.add(start.date() <= 15 ? 1 : 2, 'month');
    start.set('date', 1);

    const end = moment(start);
    end.add(1, 'month');
    end.subtract(1, 'day');

    const adjustEnd = moment(start);
    adjustEnd.subtract(1, 'month');
    adjustEnd.set({ date: 16, hour: 0, minute: 0, second: 0, millisecond: 0 });
    return { start, end, adjustEnd };
  }

  async loadEditingData(userUuid: string) {
    const [hours, siteShift, savedSchedule, userKeys] = await Promise.all([
      firstValueFrom(
        this.shiftHoursService
          .getShiftHours()
          .pipe(filter((data) => !!data))
      ).then((hours) => hours?.filter((h) => h.activate) || []),
      firstValueFrom(
        this.siteShiftsService.getSiteShiftList().pipe(filter((data) => !!data))
      ).then((data) => data || []),
      this.userScheduleService.getUserSchedule(userUuid),
      firstValueFrom(
        this.userService.getUserKeys().pipe(filter((data) => !!data))
      ),
    ]);

    this.shiftHours = hours;

    this.schedulingConfig = {
      assign: savedSchedule.assign,
      lineToken: savedSchedule.lineToken || '',
      partnerUuid:
        (savedSchedule.partnerUuid &&
          userKeys!.find(
            (userKey) => userKey.uuid === savedSchedule.partnerUuid
          )?.username) ||
        '',
      unavailableDates: savedSchedule.unavailableDates || [],
      availableHours: environment.DAY.map((dayName, day) => {
        const obj: UserScheduleDayData = { day };
        for (let hour of hours) {
          const shiftExists = siteShift.find(
            (shift) =>
              shift.shiftHoursUuid === hour.uuid && shift.weekday === day
          );
          if (shiftExists) {
            obj[hour.uuid] =
              savedSchedule.availableHours?.[day as any as '0']?.[hour.uuid] ||
              0;
          }
        }
        return obj;
      }),
    };
    this.subscribe = !!this.schedulingConfig.lineToken;
    this.partnerInput$.next(this.schedulingConfig.partnerUuid);
  }

  onSave = async () => {
    this.validationErrors = this.validateData();
    if (!this.validationErrors) {
      const saveData: UserSchedule = {
        ...this.schedulingConfig,
        availableHours: {},
      };

      if (saveData.partnerUuid) {
        const userKey = this.userKeys$.value.find(
          (key) => key.username === saveData.partnerUuid
        );
        saveData.partnerUuid = userKey!.uuid;
      } else {
        saveData.partnerUuid = '';
      }

      for (let day = 0; day < 7; ++day) {
        const data = { ...this.schedulingConfig.availableHours[day] };
        delete data.day;
        for (let hourUuid in data) {
          if (data[hourUuid] === 0) {
            delete data[hourUuid];
          }
        }
        saveData.availableHours[day as any as '0'] = data;
      }

      await this.userScheduleService.patchUserSchedule(this.uuid, saveData);
      this.snackBar.open(this.translateService.instant('GLOBAL.SAVED'));
    }
  };

  validateData = () => {
    const result: typeof this.validationErrors = {};

    function validatePartnerUuid(data: string, userKeys: UserKey[]) {
      // partnerUuid needs to match with exists user uuid
      if (!data) return true;

      const userKey = userKeys.find((key) => key.username === data);
      return !!userKey;
    }

    if (
      !validatePartnerUuid(
        this.schedulingConfig.partnerUuid,
        this.userKeys$.value
      )
    ) {
      result.partnerUuid = this.translateService.instant(
        'USERS.VALIDATION.PARTNER_NOT_FOUND'
      );
    }

    function validateUnavailableDates(
      data: string[],
      firstDayOfTheMonth: Moment
    ) {
      // user can't select all
      for (
        let date = moment(firstDayOfTheMonth);
        date.isSame(firstDayOfTheMonth, 'month');
        date.add(1, 'day')
      ) {
        const dateString = date.format('YYYY-MM-DD');
        if (!data.includes(dateString)) {
          return true;
        }
      }

      return false;
    }

    if (
      !validateUnavailableDates(
        this.schedulingConfig.unavailableDates,
        this.schedulingRange.start
      )
    ) {
      result.unavailableDates = this.translateService.instant(
        'USERS.VALIDATION.UNAVAILABLE_DATES_ALL_SELECTED'
      );
    }

    function validateAvailableHours(data: UserScheduleDayData[]) {
      // user needs to select at least one
      for (let day = 0; day < 7; ++day) {
        for (let hourUuid in data[day]) {
          if (hourUuid !== 'day' && data[day][hourUuid] > 0) {
            return true;
          }
        }
      }
      return false;
    }
    if (!validateAvailableHours(this.schedulingConfig.availableHours)) {
      result.availableHours = this.translateService.instant(
        'USERS.VALIDATION.AVAILABLE_HOURS_EMPTY'
      );
    }
    if (Object.keys(result).length > 0) return result;
    return undefined;
  };

  onUnavailableDateSelect = (date: Moment | null) => {
    if (date === null) return;
    const dateString = date.format('YYYY-MM-DD');

    const hasSelected =
      this.schedulingConfig.unavailableDates.indexOf(dateString) === -1;

    if (hasSelected) {
      this.schedulingConfig.unavailableDates = [
        ...this.schedulingConfig.unavailableDates,
        dateString,
      ];
    } else {
      this.schedulingConfig.unavailableDates =
        this.schedulingConfig.unavailableDates.filter(
          (date) => date !== dateString
        );
    }
  };

  onSubscribe = (userUuid: string) => {
    let searchParams = new URLSearchParams({
      response_type: 'code',
      client_id: 'CumN52DojP7D7fMERzuV5o',
      state: userUuid,
      redirect_uri: `${environment.BACKEND_URL}/line-notify-callback`,
      scope: 'notify',
      response_mode: 'form_post',
    });
    if (this.subscribe) {
      window.open(
        `https://notify-bot.line.me/oauth/authorize?${searchParams.toString()}`
      );
    } else {
      this.userScheduleService.cancelLineToken(userUuid);
    }
  };
}
