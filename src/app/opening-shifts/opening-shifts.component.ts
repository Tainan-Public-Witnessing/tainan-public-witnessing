import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  combineLatest,
  filter,
  from,
  map,
  merge,
  Observable,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { Shift } from '../_interfaces/shift.interface';
import { AuthorityService } from '../_services/authority.service';
import { EVENTS, GlobalEventService } from '../_services/global-event.service';
import { ShiftsService } from '../_services/shifts.service';

@Component({
  selector: 'app-opening-shifts',
  templateUrl: './opening-shifts.component.html',
  styleUrls: ['./opening-shifts.component.scss'],
})
export class OpeningShiftsComponent implements OnInit, OnDestroy {
  yearMonthControl = new FormControl<string>('');
  shifts$!: Observable<Shift[]>;
  readonly unsubscribe$: Subject<void> = new Subject();
  constructor(
    private shiftService: ShiftsService,
    private auth: AuthorityService,
    private globalEvent: GlobalEventService
  ) {}

  ngOnInit(): void {
    this.shifts$ = merge(
      this.globalEvent.getGlobalEventById(EVENTS.SHIFTS_CHANGE),
      this.yearMonthControl.valueChanges
    ).pipe(
      startWith(undefined),
      map(() => this.yearMonthControl.value),
      switchMap((yearMonth) =>
        from(
          this.shiftService.getOpeningShift(
            yearMonth!,
            this.auth.currentUserUuid$.value!
          )
        )
      )
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }
}
