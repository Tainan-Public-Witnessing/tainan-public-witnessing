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

  constructor(
    private shiftsService: ShiftsService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.shiftsToday$ = this.shiftsService.getShiftsByDate('2019-04-27').pipe(
      filter(shifts => shifts !== null),
      first(),
      map(shifts => !!shifts ? shifts : [])
    )
  }
}
