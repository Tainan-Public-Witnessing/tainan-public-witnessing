import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserKey } from 'src/app/_interfaces/user.interface';

@Component({
  selector: 'app-crew-editor',
  templateUrl: './crew-editor.component.html',
  styleUrls: ['./crew-editor.component.scss']
})
export class CrewEditorComponent implements OnInit {

  crewFormGroup!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<CrewEditorComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {crew: UserKey[]},
  ) { }

  ngOnInit(): void {
    this.crewFormGroup = this.formBuilder.group({
      crew: this.formBuilder.array(this.data.crew.map(member => this.formBuilder.control({value: member.username, disabled: false})))
    })
    console.log(this.data)
  }

  onCancelClick = () => {
    this.dialogRef.close(false);
  }

  onSubmitClick = () => {
    this.dialogRef.close(true);
  }

  getCrewControls = () => {
    return (this.crewFormGroup.get('crew') as FormArray).controls;
  }
}
