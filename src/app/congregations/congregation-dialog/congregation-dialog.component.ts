import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Mode } from 'src/app/_enums/mode.enum';
import { Status } from 'src/app/_enums/status.enum';
import { Congregation } from 'src/app/_interfaces/congregation.interface';
import { CongregationsService } from 'src/app/_services/congregations.service';
import { CongregationDialogData } from './congregation-dialog-data.interface';

@Component({
  selector: 'app-congregation-dialog',
  templateUrl: './congregation-dialog.component.html',
  styleUrls: ['./congregation-dialog.component.scss']
})
export class CongregationDialogComponent implements OnInit {

  title: string;
  congregationControl: FormControl;

  constructor(
    private dialogRef: MatDialogRef<CongregationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: CongregationDialogData,
    private congregationService: CongregationsService
  ) { }

  ngOnInit(): void {

    this.title = this.data.mode === Mode.CREATE ? 'CONGREGATIONS.CREATE_TITLE' : 'CONGREGATIONS.EDIT_TITLE';

    this.congregationControl = new FormControl('', Validators.required);

    if (this.data.mode === Mode.UPDATE) {
      this.congregationControl.setValue(this.data.congregation.name);
    }
  }

  onSubmitClick = () => {
    if (this.congregationControl.status === 'VALID') {
      let response: Promise<Status>;
      const value = this.congregationControl.value.trim();

      if (this.data.mode === Mode.CREATE) {
        response = this.congregationService.createCongregation({
          uuid: null,
          name: value
        } as Congregation);
      } else { // EDIT mode
        if (this.congregationControl.dirty) {
          response = this.congregationService.updateCongregation({
            uuid: this.data.congregation.uuid,
            name: value
          } as Congregation);
        } else { // no changes
          response = Promise.resolve(Status.NO_CHANGES);
        }
      }

      response.then(() => {
        this.dialogRef.close(null);
      }).catch(reason => {
        if (reason === Status.EXISTED) {
          this.congregationControl.setErrors({existed: true});
        }
      });
    } else {
      this.congregationControl.markAllAsTouched();
    }
  }

  onCancelClick = () => {
    this.dialogRef.close(null);
  }
}
