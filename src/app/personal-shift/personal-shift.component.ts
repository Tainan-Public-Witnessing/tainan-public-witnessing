import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';
import { Moment } from 'moment';

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
export class PersonalShiftComponent implements OnInit {

  yearMonthControl = new FormControl(moment())

  constructor() { }

  ngOnInit(): void {
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const controlValue = this.yearMonthControl.value;
    controlValue.month(normalizedMonthAndYear.month());
    controlValue.year(normalizedMonthAndYear.year());
    this.yearMonthControl.setValue(controlValue);
    datepicker.close();
  }

}
