import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { Shift } from '../_interfaces/shift.interface';
import { ShiftsService } from '../_services/shifts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  shiftsToday$!: Observable<Shift[]>;
  shiftsTomorrow$!: Observable<Shift[]>;

  constructor(
    private shiftsService: ShiftsService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.shiftsToday$ = this.shiftsService.getShiftsByDate(this.datePipe.transform(today, 'yyyy-MM-dd') as string).pipe(
      filter(shifts => shifts !== null),
      first(),
      map(shifts => !!shifts ? shifts : [])
    );
    this.shiftsTomorrow$ = this.shiftsService.getShiftsByDate(this.datePipe.transform(tomorrow, 'yyyy-MM-dd') as string).pipe(
      filter(shifts => shifts !== null),
      first(),
      map(shifts => !!shifts ? shifts : [])
    );
  }
}
