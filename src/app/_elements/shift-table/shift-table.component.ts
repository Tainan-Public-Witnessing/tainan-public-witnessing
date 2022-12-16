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
    combineLatest([this.shiftHoursService.getShiftHoursList(), this.shifts$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([_shiftHoursList, _shifts]) => {
        if (_shiftHoursList === null || _shifts === null) {
          this.sortedShift$s = null;
        } else if (_shifts === undefined) {
          this.sortedShift$s = undefined;
        } else {
          this.sortedShift$s = _shifts.map((_shift) => {
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
