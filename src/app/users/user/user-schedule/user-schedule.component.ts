import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  firstValueFrom,
  skip,
  Subject,
  takeUntil,
} from 'rxjs';
import { Permission } from 'src/app/_enums/permission.enum';
import { ShiftHours } from 'src/app/_interfaces/shift-hours.interface';
import { SiteShifts } from 'src/app/_interfaces/site-shifts.interface';
import {
  UserScheduleHours,
  UserScheduleDayData,
} from 'src/app/_interfaces/user-schedule-hours.interface';
import { AuthorityService } from 'src/app/_services/authority.service';
import { ShiftHoursService } from 'src/app/_services/shift-hours.service';
import { SiteShiftService } from 'src/app/_services/site-shifts.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-schedule',
  templateUrl: './user-schedule.component.html',
  styleUrls: ['./user-schedule.component.scss'],
})
export class UserScheduleComponent implements OnInit, OnDestroy {
  @Input() title: string;
  @Input() uuid: string;
  @Input() disabled: boolean;

  unsubscribe$ = new Subject<void>();
  requireAdmin$ = new BehaviorSubject<boolean>(false);

  shiftHours: ShiftHours[];
  hoursData: UserScheduleDayData[];

  constructor(
    private siteShiftsService: SiteShiftService,
    private shiftHoursService: ShiftHoursService,
    private authorityService: AuthorityService
  ) {}

  ngOnInit() {
    this.authorityService
      .canAccess(Permission.ADMINISTRATOR)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(this.requireAdmin$);

    this.convertIntoEditingData().then((data) => (this.hoursData = data));
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  async convertIntoEditingData() {
    const [hours, siteShift] = await Promise.all([
      firstValueFrom(
        this.shiftHoursService.getShiftHoursList().pipe(skip(1))
      ).then((hours) => hours?.filter((h) => h.activate) || []),
      firstValueFrom(this.siteShiftsService.getSiteShiftList().pipe(skip(1))),
    ]);

    this.shiftHours = hours;

    return environment.DAY.map((dayName, day) => {
      const obj: UserScheduleDayData = { day };
      for (let hour of hours) {
        const shiftExists = siteShift.find(
          (shift) => shift.shiftHoursUuid === hour.uuid && shift.weekday === day
        );
        if (shiftExists) {
          obj[hour.uuid] = 0; // TODO: fill user config value
        }
      }
      return obj;
    });
  }

  onSave = () => {};
}
