import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShiftHoursService } from 'src/app/_services/shift-hours.service';
import { ShiftHours } from 'src/app/_interfaces/shift-hours.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-shifthours-editor',
  templateUrl: '../shifthours-creator/shifthours-creator.component.html',
  styleUrls: ['../shifthours-creator/shifthours-creator.component.scss']
})
export class ShifthoursEditorComponent implements OnInit {
  shiftHoursform: FormGroup;
  constructor(
    private formbuilder: FormBuilder,
    private shiftHoursService: ShiftHoursService,
    private dialogRef: MatDialogRef<ShifthoursEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { shiftHour: ShiftHours }
  ) {
    this.shiftHoursform = this.formbuilder.group({
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
    if (this.shiftHoursform.status !== 'VALID') {
      this.shiftHoursform.markAllAsTouched();
    } else {
      const { uuid, name, startTime, endTime, activate, deliver } = this.shiftHoursform.value;
      const data = {
        uuid: uuid!,
        name: name!,
        startTime: startTime!,
        endTime: endTime!,
        activate: activate!,
        deliver: deliver!
      }
      await this.shiftHoursService.updateShiftHours(data);
      this.shiftHoursform.disable();
      this.dialogRef.close('success');
    }
  }
}
