import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ShiftHoursService } from '../../_services/shift-hours.service';
import { ShiftHour } from '../../_interfaces/shift-hours.interface';
import {
  Subject,
  BehaviorSubject,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-day-schedule',
  templateUrl: './day-schedule.component.html',
  styleUrls: ['./day-schedule.component.scss'],
})
export class DayScheduleComponent implements OnInit, OnDestroy {
  @Input() day: number;
  reloadList$ = new BehaviorSubject<void>(undefined);
  shifthours$ = new BehaviorSubject<ShiftHour[] | null>(null);
  unsubscribe$ = new Subject<void>();
  constructor(private shifthoursService: ShiftHoursService) {}

  ngOnInit(): void {
    this.reloadList$
      .pipe(
        startWith(undefined),
        switchMap(() => {
          return this.shifthoursService.getShiftHours().pipe(
            filter((f) => f !== null),
            takeUntil(this.unsubscribe$)
          );
        })
      )
      .subscribe((shifthours) => {
        this.shifthours$.next(shifthours);
      });
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
