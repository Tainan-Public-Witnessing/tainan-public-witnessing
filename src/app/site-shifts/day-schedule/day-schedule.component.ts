import { Component, Input } from '@angular/core';
import { SiteShiftFull } from 'src/app/_interfaces/site-shifts.interface';

@Component({
  selector: 'app-day-schedule',
  templateUrl: './day-schedule.component.html',
  styleUrls: ['./day-schedule.component.scss'],
})
export class DayScheduleComponent {
  @Input() siteShiftFulls: SiteShiftFull[];
  @Input() day: number;

  constructor() {}
}
