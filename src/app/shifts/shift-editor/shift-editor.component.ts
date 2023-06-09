import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import * as moment from 'moment';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { BehaviorSubject } from 'rxjs';
import { ShiftHour } from 'src/app/_interfaces/shift-hours.interface';
import { Site } from 'src/app/_interfaces/site.interface';
import { ShiftHoursService } from 'src/app/_services/shift-hours.service';
import { ShiftsService } from 'src/app/_services/shifts.service';
import { SitesService } from 'src/app/_services/sites.service';

@Component({
  selector: 'app-shift-editor',
  templateUrl: './shift-editor.component.html',
  styleUrls: ['./shift-editor.component.scss'],
})
export class ShiftEditorComponent implements OnInit {
  @AutoUnsubscribe()
  sites$ = new BehaviorSubject<Site[] | null>(null);
  @AutoUnsubscribe()
  hours$ = new BehaviorSubject<ShiftHour[] | null>(null);

  formGroup: FormGroup;

  constructor(
    shiftHourService: ShiftHoursService,
    siteService: SitesService,
    formBuilder: FormBuilder,
    private shiftService: ShiftsService,
    @Inject(MAT_DIALOG_DATA) dialogData: any,
    protected dialogRef: MatDialogRef<ShiftEditorComponent>
  ) {
    shiftHourService.getShiftHours().subscribe(this.hours$);
    siteService.getSites().subscribe(this.sites$);

    this.formGroup = formBuilder.group({
      date: [
        {
          value: (dialogData.date as moment.Moment).format('YYYY-MM-DD'),
          disabled: true,
        },
      ],
      siteUuid: ['', Validators.required],
      shiftHoursUuid: ['', Validators.required],
      attendance: [1, [Validators.required, Validators.min(1)]],
      delivers: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {}

  async onSubmit() {
    if (this.formGroup.invalid) return;
    await this.shiftService.createShift({
      ...this.formGroup.value,
      date: this.formGroup.controls['date'].value,
    });
    this.dialogRef.close(true);
  }

  onAttendanceChange(delta: number) {
    const { attendance, delivers } = this.formGroup.value;
    const newAttendance = Math.max(attendance + delta, 1);

    this.formGroup.patchValue({
      attendance: newAttendance,
      delivers: Math.min(delivers, newAttendance),
    });
  }

  onDeliverChange(delta: number) {
    const { attendance, delivers } = this.formGroup.value;

    const newDelivers = Math.max(delivers + delta, 0);
    this.formGroup.patchValue({
      attendance: Math.max(attendance, newDelivers),
      delivers: newDelivers,
    });
  }
}
