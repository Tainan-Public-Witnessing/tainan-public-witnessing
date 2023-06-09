import { Component, Input, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import {
  SiteShiftFull,
  SiteShifts,
} from 'src/app/_interfaces/site-shifts.interface';
import { SiteShiftService } from 'src/app/_services/site-shifts.service';
import { ShiftHour } from '../../_interfaces/shift-hours.interface';

enum SavingState {
  None = '',
  Saving = 'Saving',
  Saved = 'Saved',
}

@Component({
  selector: 'app-site-shift',
  templateUrl: './site-shift.component.html',
  styleUrls: ['./site-shift.component.scss'],
})
export class SiteShiftComponent implements OnInit {
  @Input() day: number;
  @Input() siteShiftFull: SiteShiftFull;
  shiftHour: ShiftHour | undefined;
  siteShift: SiteShifts;
  siteShift$ = new Subject<SiteShifts>();

  savingStateTimer: number = 0;
  private _savingState = SavingState.None;
  get savingState() {
    return this._savingState;
  }
  set savingState(value: SavingState) {
    this._savingState = value;
    clearTimeout(this.savingStateTimer);
    if (value === SavingState.Saved) {
      this.savingStateTimer = setTimeout(
        () => (this.savingState = SavingState.None),
        3000
      ) as any as number;
    }
  }
  SavingState = SavingState;

  constructor(private siteShiftService: SiteShiftService) {}
  languageMenu = [{ title: '', tag: '' }];

  ngOnInit(): void {
    this.shiftHour = this.siteShiftFull.shiftHour;
    const siteShift = this.siteShiftFull.siteShift;
    this.siteShift = {
      uuid: siteShift?.uuid ?? '',
      activate: siteShift?.activate ?? false,
      attendance: siteShift?.attendance ?? 0,
      delivers: siteShift?.delivers ?? 0,
      shiftHoursUuid: siteShift?.shiftHoursUuid ?? '',
      siteUuid: siteShift?.siteUuid ?? '',
      weekday: siteShift?.weekday ?? 0,
    };
    this.siteShift$
      .pipe(
        tap(() => (this.savingState = SavingState.Saving)),
        debounceTime(1500),
        distinctUntilChanged(
          (previous, current): boolean =>
            previous.activate === current.activate &&
            previous.attendance === current.attendance &&
            previous.delivers === current.delivers
        )
      )
      .subscribe(async (data) => {
        await this.siteShiftService.updateSiteShift(data);
        this.savingState = SavingState.Saved;
      });
  }

  onAttendanceChange(delta: number) {
    const { attendance, delivers } = this.siteShift;

    this.siteShift.attendance = Math.max(attendance + delta, 0);
    this.siteShift.delivers = Math.min(delivers, this.siteShift.attendance);
    this.siteShift.activate = this.siteShift.attendance > 0;

    this.siteShift$.next({ ...this.siteShift });
  }

  onDeliverChange(delta: number) {
    const { attendance, delivers } = this.siteShift;

    this.siteShift.delivers = Math.max(delivers + delta, 0);
    this.siteShift.attendance = Math.max(
      this.siteShift.attendance,
      this.siteShift.delivers
    );
    this.siteShift.activate = this.siteShift.attendance > 0;

    this.siteShift$.next({ ...this.siteShift });
  }
}
