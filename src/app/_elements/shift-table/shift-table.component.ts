import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, first, takeUntil } from 'rxjs/operators';
import { ShiftHours } from 'src/app/_interfaces/shift-hours.interface';
import { Shift } from 'src/app/_interfaces/shift.interface';
import { ShiftHoursService } from 'src/app/_services/shift-hours.service';

@Component({
  selector: 'app-shift-table',
  templateUrl: './shift-table.component.html',
  styleUrls: ['./shift-table.component.scss']
})
export class ShiftTableComponent implements OnInit, OnDestroy {

  @Input() shifts$!: Observable<Shift[]>;

  shiftHoursList$!: Observable<ShiftHours[]>;
  sortedShifts: Shift[] = [];
  destroy$ = new Subject<void>();

  constructor(
    private shiftHoursService: ShiftHoursService,
  ) { }

  ngOnInit(): void {
    this.shiftHoursList$ = this.shiftHoursService.getShiftHoursList().pipe(
      filter(_shiftHoursList => _shiftHoursList !== null),
      first(),
    ) as Observable<ShiftHours[]>;

    combineLatest([
      this.shiftHoursList$,
      this.shifts$,
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([shiftHoursList, shifts]) => {
      this.sortedShifts = shifts.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare === 0) {
          let aStartTime = '';
          let bStartTime = '';
          shiftHoursList.forEach(shiftHours => {
            if (shiftHours.uuid === a.shiftHoursUuid) {
              aStartTime = shiftHours.startTime;
            }
            if (shiftHours.uuid === b.shiftHoursUuid) {
              bStartTime = shiftHours.startTime;
            }
          });
          return aStartTime.localeCompare(bStartTime);
        } else {
          return dateCompare;
        }
      }) 
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
