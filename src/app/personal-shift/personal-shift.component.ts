import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { forkJoin, Observable, of } from 'rxjs';
import { filter, first, map, startWith, switchAll } from 'rxjs/operators';
import { Shift } from '../_interfaces/shift.interface';
import { AuthorityService } from '../_services/authority.service';
import { PersonalShiftsService } from '../_services/personal-shifts.service';
import { ShiftsService } from '../_services/shifts.service';

@Component({
  selector: 'app-personal-shift',
  templateUrl: './personal-shift.component.html',
  styleUrls: ['./personal-shift.component.scss'],
})
export class PersonalShiftComponent implements OnInit {

  yearMonthControl = new FormControl(moment());
  shifts$!: Observable<Shift[]|null|undefined>;

  constructor(
    private authorityService: AuthorityService,
    private personalShiftsService: PersonalShiftsService,
    private shiftsService: ShiftsService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {

    this.shifts$ = this.yearMonthControl.valueChanges.pipe(
      filter(_value => !!_value),
      map(_momentDate => _momentDate?.format('yyyy-MM') as string),
      startWith(this.datePipe.transform(new Date(), 'yyyy-MM') as string),
      map(_yearMonth => this.personalShiftsService.getPersonalShifts(_yearMonth, this.authorityService.currentUserUuid$.value as string)),
      switchAll(),
      filter(_personalShift => _personalShift !== null),
      map(_personalShift => {
        if (!!_personalShift) {
          const _yearMonth = this.yearMonthControl.value?.format('yyyy-MM') as string;
          const _shiftUuids = _personalShift?.shiftUuids as string[];
          if (_shiftUuids.length === 0) return undefined;
          return this.shiftsService.getShiftsByUuids(_yearMonth, _shiftUuids);
        } else {
          return undefined;
        }
      }),
      map(_shift$s => {
        if (_shift$s !== undefined) {
          return forkJoin(
            _shift$s.map(_shift$ => _shift$.pipe(filter(_shift => !!_shift), first())) as Observable<Shift>[]
          );
        } else {
          return of(undefined);
        }
      }),
      switchAll(),
    );
  }



}
