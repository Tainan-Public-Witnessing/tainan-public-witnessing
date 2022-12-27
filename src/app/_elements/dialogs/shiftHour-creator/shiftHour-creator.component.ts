import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ShiftHoursService } from 'src/app/_services/shift-hours.service';
import { ShiftHour } from 'src/app/_interfaces/shift-hours.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-shiftHour-creator',
  templateUrl: './shiftHour-creator.component.html',
  styleUrls: ['./shiftHour-creator.component.scss']
})
export class ShiftHoursCreatorComponent implements OnInit {
  shiftHourform: FormGroup;

  constructor(
    private formbuilder: FormBuilder,
    private shiftHoursService: ShiftHoursService,
    private dialogRef: MatDialogRef<ShiftHoursCreatorComponent>
  ) {
    this.shiftHourform = this.formbuilder.group({
      name: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    })
  }

  ngOnInit(): void { }
  onCancelClick = () => {
    this.dialogRef.close();
  }
  onSubmitClick = async () => {
    if (this.shiftHourform.status !== 'VALID') {
      this.shiftHourform.markAllAsTouched();
    }
    else {
      const { name, startTime, endTime } = this.shiftHourform.value;
      const shiftHour: Omit<ShiftHour, 'uuid' | 'activate' | 'deliver'> = {
        name,
        startTime,
        endTime
      }
      await this.shiftHoursService.createShiftHours(shiftHour);
      this.shiftHourform.disable();
      this.dialogRef.close('success');
    }
  }
}
