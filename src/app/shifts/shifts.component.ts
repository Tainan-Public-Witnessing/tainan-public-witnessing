import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { BehaviorSubject, Subject, combineLatest, merge } from 'rxjs';
import {
  combineLatestAll,
  filter,
  map,
  mergeWith,
  startWith,
  switchAll,
} from 'rxjs/operators';
import { ShiftEditorComponent } from 'src/app/shifts/shift-editor/shift-editor.component';
import { Shift } from '../_interfaces/shift.interface';
import { ShiftsService } from '../_services/shifts.service';
import { log } from 'src/app/_helpers/rxjs-helper';
import {
  EVENTS,
  GlobalEventService,
} from 'src/app/_services/global-event.service';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.scss'],
  providers: [],
})
export class ShiftsComponent implements OnInit {
  dateControl = new FormControl(moment());
  @AutoUnsubscribe()
  reload$ = new Subject<void>();
  @AutoUnsubscribe()
  shifts$ = new BehaviorSubject<Shift[] | null | undefined>(undefined);

  constructor(
    private shiftsService: ShiftsService,
    private datePipe: DatePipe,
    private matDialog: MatDialog,
    private globalEvent: GlobalEventService
  ) {}

  ngOnInit(): void {
    merge(
      this.dateControl.valueChanges,
      this.globalEvent.getGlobalEventById(EVENTS.SHIFTS_CHANGE)
    )
      .pipe(
        startWith(undefined),
        map(() => this.dateControl.value!.format('yyyy-MM-DD')),
        map((date) => this.shiftsService.getShiftsByDate(date, true)),
        switchAll()
      )
      .subscribe(this.shifts$);
  }

  onOpenDialog() {
    this.matDialog
      .open(ShiftEditorComponent, {
        data: { date: this.dateControl.value },
      })
      .afterClosed()
      .subscribe((dataChanged: boolean) => {
        if (dataChanged) {
          this.globalEvent.emitGlobalEvent({ id: EVENTS.SHIFTS_CHANGE });
        }
      });
  }
}
