import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
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

  addMember = () => {
    const crewControls = this.crewFormGroup.get('crew') as FormArray;
    crewControls.push(this.formBuilder.control({value: '', disabled: false}));
  }

  removeMember = (index: number) => {
    (this.crewFormGroup.get('crew') as FormArray).removeAt(index);
    this.crewFormGroup.markAsDirty();
  }

  drop = (event: CdkDragDrop<AbstractControl[]>) => {
    const controls = this.getCrewControls();
    moveItemInArray(controls, event.previousIndex, event.currentIndex);
  }
}
