import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ShiftHoursService } from 'src/app/_services/shift-hours.service';
import { ShiftHours } from 'src/app/_interfaces/shift-hours.interface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-shifthours-creator',
  templateUrl: './shifthours-creator.component.html',
  styleUrls: ['./shifthours-creator.component.scss']
})
export class ShifthoursCreatorComponent implements OnInit {
  shiftHoursform: FormGroup;

  constructor(
    private formbuilder: FormBuilder,
    private shiftHoursService: ShiftHoursService,
    private dialogRef: MatDialogRef<ShifthoursCreatorComponent>
  ) {
    this.shiftHoursform = this.formbuilder.group({
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
    if (this.shiftHoursform.status !== 'VALID') {
      this.shiftHoursform.markAllAsTouched();
    }
    else {
      const { name, startTime, endTime } = this.shiftHoursform.value;
      const shifthours: Omit<ShiftHours, 'uuid' | 'activate' | 'deliver'> = {
        name,
        startTime,
        endTime
      }
      await this.shiftHoursService.createShiftHours(shifthours);
      this.shiftHoursform.disable();
      this.dialogRef.close('success');
    }
  }
}
