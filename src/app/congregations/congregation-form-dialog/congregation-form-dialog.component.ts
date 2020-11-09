import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Congregation } from 'src/app/_interfaces/congregation.interface';
import { CongregationFormDialogData } from './congregation-form-dialog-data.interface';

@Component({
  selector: 'app-congregation-form-dialog',
  templateUrl: './congregation-form-dialog.component.html',
  styleUrls: ['./congregation-form-dialog.component.scss']
})
export class CongregationFormDialogComponent implements OnInit {

  mode: string;
  title: string;
  congregationControl: FormControl;

  constructor(
    private dialogRef: MatDialogRef<CongregationFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: CongregationFormDialogData
  ) { }

  ngOnInit(): void {
    this.mode = this.data.mode;
    this.title = this.mode === 'CREATE' ? 'Create congregation' : 'Edit congregation';
    this.congregationControl = new FormControl('', Validators.required);
  }

  onSubmitClick = () => {
    if (this.congregationControl.status === 'VALID') {
      this.dialogRef.close({
        uuid: null,
        name: this.congregationControl.value
      } as Congregation);
    }
  }

  onCancelClick = () => {
    this.dialogRef.close(null);
  }

}
