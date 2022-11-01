import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Subject } from 'rxjs';
import { Shift } from '../_interfaces/shift.interface';

@Component({
  selector: 'app-opening-shifts',
  templateUrl: './opening-shifts.component.html',
  styleUrls: ['./opening-shifts.component.scss'],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['YYYY-MM'],
        },
        display: {
          dateInput: 'YYYY-MM',
          monthYearLabel: 'MM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MM YYYY',
        },
      },
    },
  ],
})
export class OpeningShiftsComponent implements OnInit {
  yearMonthControl = new FormControl(moment());
  shifts$!: Subject<Shift[] | null | undefined>;

  constructor() {}

  ngOnInit(): void {}

  setMonthAndYear(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const controlValue = this.yearMonthControl.value;
    if (controlValue !== null) {
      controlValue.year(normalizedMonthAndYear.year());
      controlValue.month(normalizedMonthAndYear.month());
      this.yearMonthControl.setValue(controlValue);
    }
    datepicker.close();
  }
}
