import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';
import { Moment } from 'moment';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { filter, map, startWith, switchAll, takeUntil } from 'rxjs/operators';
import { Shift } from '../_interfaces/shift.interface';
import { AuthorityService } from '../_services/authority.service';
import { PersonalShiftsService } from '../_services/personal-shifts.service';
import { ShiftsService } from '../_services/shifts.service';

@Component({
  selector: 'app-personal-shift',
  templateUrl: './personal-shift.component.html',
  styleUrls: ['./personal-shift.component.scss'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: {
      parse: {
          dateInput: ['YYYY-MM'],
      },
      display: {
          dateInput: 'YYYY-MM',
          monthYearLabel: 'MM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MM YYYY',
      },
  },},
  ]
})
export class PersonalShiftComponent implements OnInit, AfterViewInit, OnDestroy {

  yearMonthControl = new FormControl(moment());
  shifts$ = new BehaviorSubject<Shift[]|null>(null);
  shiftsLength = 0;
  destroy$ = new Subject<void>();

  constructor(
    private authorityService: AuthorityService,
    private personalShiftsService: PersonalShiftsService,
    private shiftsService: ShiftsService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    const yearMonth$ = this.yearMonthControl.valueChanges.pipe(
      filter(value => !!value),
      map(momentDate => momentDate as moment.Moment),
      map(momentDate => momentDate.format('yyyy-MM')),
      startWith(this.datePipe.transform(new Date(), 'yyyy-MM') as string),
    );

    const personalShifts$ = yearMonth$.pipe(
      map(yearMonth => this.personalShiftsService.getPersonalShift(yearMonth, this.authorityService.currentUserUuid$.value as string)),
      switchAll(),
      filter(personalShift => personalShift !== null),
    );

    personalShifts$.pipe(
      map(personalShift => personalShift !== undefined ? this.shiftsService.getShiftsByUuids((this.yearMonthControl.value as moment.Moment).format('yyyy-MM'), personalShift?.shiftUuids as string[]) : []),
      map((_shift$list: BehaviorSubject<Shift | null | undefined>[]) => {
        if (_shift$list.length > 0) {
          return combineLatest(_shift$list.map(_shift$ => _shift$.pipe(filter(_shift => _shift !== null))));
        } else {
          return of([]);
        }
      }),
      switchAll(),
      takeUntil(this.destroy$),
    ).subscribe(_shifts => this.shifts$.next(_shifts as Shift[]));

    this.shifts$.pipe(
      filter(_shifts => _shifts !== null),
      map(_shifts => _shifts as Shift[]),
      takeUntil(this.destroy$)
    ).subscribe(_shifts => this.shiftsLength = _shifts.length);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const controlValue = this.yearMonthControl.value;
    if (controlValue !== null) {
      controlValue.year(normalizedMonthAndYear.year());
      controlValue.month(normalizedMonthAndYear.month());
      this.yearMonthControl.setValue(controlValue);
    }
    datepicker.close();
  }

}
