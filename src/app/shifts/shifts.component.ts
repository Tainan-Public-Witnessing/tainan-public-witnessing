import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { Shift } from '../_interfaces/shift.interface';
import { filter, map, startWith, switchAll } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { ShiftsService } from '../_services/shifts.service';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.scss'],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['YYYY-MM-DD'],
        },
        display: {
          dateInput: 'YYYY-MM-DD',
          monthYearLabel: 'MM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MM YYYY',
        },
      },
    },
  ],
})
export class ShiftsComponent implements OnInit {

  dateControl = new FormControl(moment());
  shifts$!: Observable<Shift[]|null|undefined>;
  destroy$ = new Subject<void>();

  constructor(
    private shiftsService: ShiftsService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.shifts$ = this.dateControl.valueChanges.pipe(
      filter(value => !!value),
      map(momentDate => momentDate as moment.Moment),
      map(momentDate => momentDate.format('yyyy-MM-DD')),
      startWith(this.datePipe.transform(new Date(), 'yyyy-MM-dd') as string),
      map(date => this.shiftsService.getShiftsByDate(date)),
      switchAll(),
    );
  }
}
