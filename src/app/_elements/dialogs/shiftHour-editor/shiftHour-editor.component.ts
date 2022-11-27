import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShiftHoursService } from 'src/app/_services/shift-hours.service';
import { ShiftHour } from 'src/app/_interfaces/shift-hours.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-shiftHours-editor',
  templateUrl: '../shiftHour-creator/shiftHour-creator.component.html',
  styleUrls: ['../shiftHour-creator/shiftHour-creator.component.scss']
})
export class ShiftHoursEditorComponent implements OnInit {
  shiftHourform: FormGroup;
  constructor(
    private formbuilder: FormBuilder,
    private shiftHoursService: ShiftHoursService,
    private dialogRef: MatDialogRef<ShiftHoursEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { shiftHour: ShiftHour }
  ) {
    this.shiftHourform = this.formbuilder.group({
      uuid: [this.data.shiftHour.uuid],
      activate: [this.data.shiftHour.activate],
      deliver: [this.data.shiftHour.deliver],
      name: [this.data.shiftHour.name, Validators.required],
      startTime: [this.data.shiftHour.startTime, Validators.required],
      endTime: [this.data.shiftHour.endTime, Validators.required]
    })
  }

  ngOnInit(): void {
  }
  onCancelClick = () => {
    this.dialogRef.close();
  }
  onSubmitClick = async () => {
    if (this.shiftHourform.status !== 'VALID') {
      this.shiftHourform.markAllAsTouched();
    } else {
      const { uuid, name, startTime, endTime, activate, deliver } = this.shiftHourform.value;
      const data = {
        uuid: uuid!,
        name: name!,
        startTime: startTime!,
        endTime: endTime!,
        activate: activate!,
        deliver: deliver!
      }
      await this.shiftHoursService.updateShiftHours(data);
      this.shiftHourform.disable();
      this.dialogRef.close('success');
    }
  }
}
