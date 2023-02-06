import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Shift } from 'src/app/_interfaces/shift.interface';
import { ShiftHoursService } from 'src/app/_services/shift-hours.service';
import { ShiftsService } from 'src/app/_services/shifts.service';

@Component({
  selector: 'app-shift-table',
  templateUrl: './shift-table.component.html',
  styleUrls: ['./shift-table.component.scss'],
})
export class ShiftTableComponent implements OnInit, OnDestroy {
  @Input() shifts$!: Observable<Shift[] | null | undefined>;
  @Input() showEmpty: boolean = false;

  sortedShift$s: Observable<Shift>[] | null | undefined = null;
  destroy$ = new Subject<void>();

  constructor(
    private shiftHoursService: ShiftHoursService,
    private shiftsService: ShiftsService
  ) {}

  ngOnInit(): void {
    combineLatest([this.shiftHoursService.getShiftHours(), this.shifts$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([shiftHours, shifts]) => {
        if (shiftHours === null || shifts === null) {
          this.sortedShift$s = null;
        } else if (shifts === undefined) {
          this.sortedShift$s = undefined;
        } else {
          const hour = (shiftHourUuid: string) =>
            shiftHours?.find((hour) => hour.uuid === shiftHourUuid)
              ?.startTime ?? '00:00';

          this.sortedShift$s = shifts
            .sort((a, b) => {
              if (a.date !== b.date) return a.date.localeCompare(b.date);
              if (a.siteUuid !== b.siteUuid)
                return a.siteUuid.localeCompare(b.siteUuid);
              return hour(a.shiftHoursUuid).localeCompare(
                hour(b.shiftHoursUuid)
              );
            })
            .map((_shift) => {
              return this.shiftsService
                .getShiftByUuid(_shift.date.slice(0, 7), _shift.uuid)
                .pipe(filter((__shift) => !!__shift)) as Observable<Shift>;
            });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
