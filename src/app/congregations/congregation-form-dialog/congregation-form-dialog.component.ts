import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Congregation } from 'src/app/_interfaces/congregation.interface';
import { CongregationsService } from 'src/app/_services/congregations.service';
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
    @Inject(MAT_DIALOG_DATA) private data: CongregationFormDialogData,
    private congregationService: CongregationsService
  ) { }

  ngOnInit(): void {
    this.mode = this.data.mode;
    this.title = this.mode === 'CREATE' ? 'Create congregation' : 'Edit congregation';
    this.congregationControl = new FormControl('', Validators.required);
    if (this.mode === 'EDIT') {
      this.congregationControl.setValue(this.data.congregation.name);
    }
  }

  onSubmitClick = () => {
    if (this.congregationControl.status === 'VALID') {
      let response: Promise<string>;

      if (this.mode === 'CREATE') {
        response = this.congregationService.createCongregation({
          uuid: null,
          name: this.congregationControl.value
        } as Congregation);
      } else { // EDIT mode
        response = this.congregationService.updateCongregation({
          uuid: this.data.congregation.uuid,
          name: this.congregationControl.value
        } as Congregation);
      }

      response.then(() => {
        this.dialogRef.close(null);
      }).catch(reason => console.log(reason));
    }
  }

  onCancelClick = () => {
    this.dialogRef.close(null);
  }

}
