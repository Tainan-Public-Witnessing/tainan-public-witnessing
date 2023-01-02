import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  combineLatest,
  filter,
  from,
  map,
  Observable,
  startWith,
  Subject,
  switchMap
} from 'rxjs';
import { Shift } from '../_interfaces/shift.interface';
import { AuthorityService } from '../_services/authority.service';
import { GlobalEventService } from '../_services/global-event.service';
import { ShiftHoursService } from '../_services/shift-hours.service';
import { ShiftsService } from '../_services/shifts.service';

@Component({
  selector: 'app-opening-shifts',
  templateUrl: './opening-shifts.component.html',
  styleUrls: ['./opening-shifts.component.scss'],
})
export class OpeningShiftsComponent implements OnInit, OnDestroy {
  yearMonthControl = new FormControl<string>('');
  shifts$!: Observable<Shift[]>;
  readonly unsubscribe$: Subject<void> = new Subject();
  constructor(
    private shiftService: ShiftsService,
    private shiftHourService: ShiftHoursService,
    private auth: AuthorityService,
    private globalEvent: GlobalEventService
  ) {}

  ngOnInit(): void {
    this.shifts$ = combineLatest([
      combineLatest([
        this.globalEvent
          .getGlobalEventById('SHIFTS_CHANGED')
          .pipe(startWith(undefined)),
        this.yearMonthControl.valueChanges.pipe(startWith(undefined)),
      ]).pipe(
        map(() => this.yearMonthControl.value),
        filter((value) => !!value),
        switchMap((yearMonth) =>
          from(
            this.shiftService.getOpeningShift(
              yearMonth!,
              this.auth.currentUserUuid$.value!
            )
          )
        )
      ),
      this.shiftHourService.getShiftHours(),
    ]).pipe(
      map(([shifts, shiftHours]) => {
        const hour = (shiftHourUuid: string) =>
          shiftHours?.find((hour) => hour.uuid === shiftHourUuid)?.startTime ??
          '00:00';
        return shifts.sort((a, b) => {
          if (a.date !== b.date) return a.date.localeCompare(b.date);
          if (a.siteUuid !== b.siteUuid)
            return a.siteUuid.localeCompare(b.siteUuid);
          return hour(a.shiftHoursUuid).localeCompare(hour(b.shiftHoursUuid));
        });
      })
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }
}
