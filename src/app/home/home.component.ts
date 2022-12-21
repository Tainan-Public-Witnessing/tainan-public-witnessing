import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, map, Observable, Subject } from 'rxjs';
import { ShiftHours } from '../_interfaces/shift-hours.interface';
import { Shift } from '../_interfaces/shift.interface';
import { ShiftHoursService } from '../_services/shift-hours.service';
import { ShiftsService } from '../_services/shifts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  shiftsToday$!: Observable<Shift[] | null | undefined>;
  shiftsTomorrow$!: Observable<Shift[] | null | undefined>;
  destroy$ = new Subject<void>();

  constructor(
    private shiftsService: ShiftsService,
    private shiftHoursService: ShiftHoursService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const today = new Date();
    const todayString = this.datePipe.transform(today, 'yyyy-MM-dd') as string;
    this.shiftsToday$ = combineLatest([
      this.shiftsService.getShiftsByDate(todayString),
      this.shiftHoursService.getShiftHoursList(),
    ]).pipe(map(sortShiftsForHome));

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = this.datePipe.transform(
      tomorrow,
      'yyyy-MM-dd'
    ) as string;
    this.shiftsTomorrow$ = combineLatest([
      this.shiftsService.getShiftsByDate(tomorrowString),
      this.shiftHoursService.getShiftHoursList(),
    ]).pipe(map(sortShiftsForHome));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

function sortShiftsForHome([shifts, shiftHours]: [
  Shift[] | undefined | null,
  ShiftHours[] | undefined | null
]) {
  if (!shifts || !shiftHours) return shifts;
  const getHour = (hourUuid: string) =>
    shiftHours.find((shiftHour) => shiftHour.uuid === hourUuid)?.startTime ??
    '00:00';
  return shifts.sort((a, b) => {
    if (a.siteUuid !== b.siteUuid) return a.siteUuid.localeCompare(b.siteUuid);
    return getHour(a.shiftHoursUuid).localeCompare(getHour(b.shiftHoursUuid));
  });
}
