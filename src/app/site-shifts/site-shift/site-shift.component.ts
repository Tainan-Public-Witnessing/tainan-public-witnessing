import { Component, Input, OnInit } from '@angular/core';
import { ShiftHour } from '../../_interfaces/shift-hours.interface';
import {
  SiteShifts,
  SiteShiftFull,
} from 'src/app/_interfaces/site-shifts.interface';
import { SiteShiftService } from 'src/app/_services/site-shifts.service';
import { Subject, debounceTime } from 'rxjs';
import { distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

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
  constructor(
    private siteShiftService: SiteShiftService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}
  languageMenu = [{ title: '', tag: '' }];
  getLang(data: any) {
    this.languageMenu = [
      { title: data.TW, tag: 'zh-TW' },
      { title: data.US, tag: 'en-US' },
    ];
  }
  ngOnInit(): void {
    this.shiftHour = this.siteShiftFull.shiftHour;
    const siteShift = this.siteShiftFull.siteShift;
    this.siteShift = {
      uuid: siteShift?.uuid === undefined ? '' : siteShift.uuid,
      activate: siteShift?.activate === undefined ? false : siteShift.activate,
      attendence:
        siteShift?.attendence === undefined ? 0 : siteShift.attendence,
      delivers: siteShift?.delivers === undefined ? 0 : siteShift.delivers,
      shiftHoursUuid:
        siteShift?.shiftHoursUuid === undefined ? '' : siteShift.shiftHoursUuid,
      siteUuid: siteShift?.siteUuid === undefined ? '' : siteShift.siteUuid,
      weekday: siteShift?.weekday === undefined ? 0 : siteShift.weekday,
    };
    this.siteShift$
      .pipe(
        debounceTime(1500),
        distinctUntilChanged(
          (previous, current): boolean =>
            previous.activate === current.activate &&
            previous.attendence === current.attendence &&
            previous.delivers === current.delivers
        )
      )
      .subscribe(async (data) => {
        await this.siteShiftService.updateSiteShift(data);
        let day = this.translate.instant(`WEEKDAYS.${this.day}`);
        let confirm = this.translate.instant('GLOBAL.CONFIRM');
        let updateInfo = this.translate.instant('SITE-SHIFTS.UPDATEINFO');
        this.snackBar.open(
          `[${day}] [${this.shiftHour?.name}] ${updateInfo}`,
          confirm,
          {
            duration: 5000,
          }
        );
      });
  }
  OnAddAttendence() {
    this.siteShift.attendence++;
    this.siteShift$.next({ ...this.siteShift });
  }
  OnSubtractAttendence() {
    let { attendence } = this.siteShift;
    if (attendence > 0) {
      attendence--;
      this.siteShift.attendence = attendence < 0 ? 0 : attendence;
      this.siteShift$.next({ ...this.siteShift });
    }
  }
  OnAddDeliver() {
    this.siteShift.delivers++;
    this.siteShift$.next({ ...this.siteShift });
  }
  OnSubtractDeliver() {
    let { delivers } = this.siteShift;
    if (delivers > 0) {
      delivers--;
      this.siteShift.delivers = delivers < 0 ? 0 : delivers;
      this.siteShift$.next({ ...this.siteShift });
    }
  }
  OnCheckChange(event: HTMLInputElement) {
    console.log(event.checked);
    this.siteShift.activate = event.checked;
    this.siteShift$.next({ ...this.siteShift });
  }
  setCardClass() {
    return (this.siteShift.activate ? 'activate' : 'inactivate') + ' mb-5';
  }

  setDeliverColor() {
    const { activate, delivers } = this.siteShift;
    let colorClass = '';
    if (activate && delivers > 0) colorClass = 'activate-deliver';
    return colorClass;
  }

  setGroupColor() {
    const { activate, attendence } = this.siteShift;
    let colorClass = '';
    if (activate && attendence > 0) colorClass = 'activate-group';
    else if (activate && attendence == 0) colorClass = 'warn-group';
    return colorClass;
  }
}
