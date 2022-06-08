import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDateRangePickerInput } from '@angular/material/datepicker/date-range-picker';
import * as moment from 'moment';
import { Moment } from 'moment';
import { filter, map, Subject, take, takeUntil } from 'rxjs';
import { Shift } from '../_interfaces/shift.interface';
import { AuthorityService } from '../_services/authority.service';
import { PersonalShiftsService } from '../_services/personal-shifts.service';

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
export class PersonalShiftComponent implements OnInit, OnDestroy {

  yearMonthControl = new FormControl(moment());
  shifts: Shift[] = [];
  destroy$ = new Subject<void>();

  constructor(
    private authorityService: AuthorityService,
    private personalShiftsService: PersonalShiftsService,
  ) { }

  ngOnInit(): void {
    this.yearMonthControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      filter(value => !!value),
      map(momentDate => momentDate.format('yyyy-MM')),
      // map(yearMonth => this.personalShiftsService.getPersonalShift(this.authorityService.currentUserUuid$.value, yearMonth))
    ).subscribe(value => {
      console.log(value)
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const controlValue = this.yearMonthControl.value;
    controlValue.month(normalizedMonthAndYear.month());
    controlValue.year(normalizedMonthAndYear.year());
    this.yearMonthControl.setValue(controlValue);
    datepicker.close();
  }

}
