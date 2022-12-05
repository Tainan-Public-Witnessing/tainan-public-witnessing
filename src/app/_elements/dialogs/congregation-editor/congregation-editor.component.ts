import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CongregationsService } from 'src/app/_services/congregations.service';
import { Congregation } from 'src/app/_interfaces/congregation.interface';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-congregation-editor',
  templateUrl: '../congregation-creator/congregation-creator.component.html',
  styleUrls: ['../congregation-creator/congregation-creator.component.scss']
})
export class CongregationEditorComponent implements OnInit {
  congregationform: FormGroup;
  constructor(private formbuilder: FormBuilder,
    private congregationsService: CongregationsService,
    private dialogRef: MatDialogRef<CongregationEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { congregation: Congregation }) { }

  ngOnInit(): void {
  }
  onCancelClick = () => {
    this.dialogRef.close();
  };
  onSubmitClick = async () => {
    if (this.congregationform.status !== 'VALID') {
      this.congregationform.markAllAsTouched();
    } else {
      const { uuid, name } = this.congregationform.value;
      const cong: Omit<Congregation, 'activate' | 'order'> = {
        uuid,
        name
      };
      await this.congregationsService.updateCongregation(cong);
      this.congregationform.disable();
      this.dialogRef.close('success');
    }
  };
}
