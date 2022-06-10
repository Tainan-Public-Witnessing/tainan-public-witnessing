import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { filter, first } from 'rxjs/operators';
import { Shift } from '../_interfaces/shift.interface';
import { ShiftsService } from '../_services/shifts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  shiftsOfToday: Shift[]|null = null;

  constructor(
    private shiftsService: ShiftsService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.shiftsService.getShiftsByDate(this.datePipe.transform(new Date(), 'yyyy-MM-dd') as string).pipe(
      filter(shifts => shifts !== null),
      first()
    ).subscribe(shifts => this.shiftsOfToday = shifts as Shift[]|null)
  }

}
