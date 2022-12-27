import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CongregationsService } from 'src/app/_services/congregations.service';
import { Congregation } from 'src/app/_interfaces/congregation.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-congregation-creator',
  templateUrl: './congregation-creator.component.html',
  styleUrls: ['./congregation-creator.component.scss']
})
export class CongregationCreatorComponent implements OnInit {
  congregationform: FormGroup;
  constructor(
    private formbuilder: FormBuilder,
    private congregationsService: CongregationsService,
    private dialogRef: MatDialogRef<CongregationCreatorComponent>
  ) {
    this.congregationform = this.formbuilder.group({
      name: ['', Validators.required]
    });
  };

  ngOnInit(): void {
  }
  onCancelClick = () => {
    this.dialogRef.close();
  };

  onSubmitClick = async () => {
    if (this.congregationform.status !== 'VALID') {
      this.congregationform.markAllAsTouched();
    } else {
      const { name } = this.congregationform.value;
      const congregation: Omit<Congregation, 'uuid' | 'activate' | 'order'> = {
        name
      };
      await this.congregationsService.createCongregation(congregation);
      this.congregationform.disable();
      this.dialogRef.close('success');
    }
  };
}
