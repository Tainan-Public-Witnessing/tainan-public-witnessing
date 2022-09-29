import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ShiftHours } from 'src/app/_interfaces/shift-hours.interface';
import { UserScheduleDayData } from 'src/app/_interfaces/user-schedule.interface';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-user-schedule-hours-list',
  templateUrl: './hours-list.component.html',
})
export class HoursListComponent implements OnInit, OnChanges {
  @Input() data: UserScheduleDayData[];
  @Input() hours: ShiftHours[];
  @Input() disabled: boolean;
  @Output() change = new EventEmitter<UserScheduleDayData[]>();
  weekdayNames = environment.DAY;

  displayedCols: string[] = [];
  unsubscribe$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hours && changes.hours.currentValue) {
      this.displayedCols = [
        'day',
        ...this.hours
          .sort((a, b) => a.startTime.localeCompare(b.startTime))
          .map((h) => h.uuid),
      ];
    }
  }

  onHourClick = (row: UserScheduleDayData, hour: ShiftHours) => {
    row[hour.uuid] = (row[hour.uuid] + 1) % 5;
    this.change.emit(this.data);
  };
}
