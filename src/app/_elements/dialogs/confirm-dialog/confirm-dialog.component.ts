import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogData } from './confirm-dialog-data.interface';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  title: string;
  message: string;
  hideCancelButton: boolean;

  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: ConfirmDialogData
  ) {}

  ngOnInit(): void {
    this.title = this.data.title;
    this.message = this.data.message;
    this.hideCancelButton = this.data.hideCancelButton || false;
  }

  onConfirmClick = () => {
    this.dialogRef.close(true);
  };

  onCancelClick = () => {
    this.dialogRef.close(false);
  };
}
