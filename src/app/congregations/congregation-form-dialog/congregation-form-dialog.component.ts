import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CongregationFormDialogData } from './congregation-form-dialog-data.interface';

@Component({
  selector: 'app-congregation-form-dialog',
  templateUrl: './congregation-form-dialog.component.html',
  styleUrls: ['./congregation-form-dialog.component.scss']
})
export class CongregationFormDialogComponent implements OnInit {

  mode: string;
  title: string;

  constructor(
    private dialogRef: MatDialogRef<CongregationFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: CongregationFormDialogData
  ) { }

  ngOnInit(): void {
    this.mode = this.data.mode;
    this.title = this.mode === 'CREATE' ? 'Create congregation' : 'Edit congregation';
  }

  onSubmitClick = () => {
    this.dialogRef.close('hi');
  }

  onCancelClick = () => {
    this.dialogRef.close(null);
  }

}
