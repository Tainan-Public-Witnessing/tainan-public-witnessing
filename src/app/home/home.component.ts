import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Shift } from '../_interfaces/shift.interface';
import { ShiftsService } from '../_services/shifts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  shiftsToday$!: Observable<Shift[]|null|undefined>;
  shiftsTomorrow$!: Observable<Shift[]|null|undefined>;
  destroy$ = new Subject<void>();

  constructor(
    private shiftsService: ShiftsService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    const today = new Date();
    const todayString = this.datePipe.transform(today, 'yyyy-MM-dd') as string;
    this.shiftsToday$ = this.shiftsService.getShiftsByDate(todayString);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = this.datePipe.transform(tomorrow, 'yyyy-MM-dd') as string;
    this.shiftsTomorrow$ = this.shiftsService.getShiftsByDate(tomorrowString);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
