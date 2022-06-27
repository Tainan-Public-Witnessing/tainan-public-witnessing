import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter, first } from 'rxjs/operators';
import { Shift } from 'src/app/_interfaces/shift.interface';
import { UserKey } from 'src/app/_interfaces/user.interface';
import { ShiftsService } from 'src/app/_services/shifts.service';
import { UsersService } from 'src/app/_services/users.service';

@Component({
  selector: 'app-crew-editor',
  templateUrl: './crew-editor.component.html',
  styleUrls: ['./crew-editor.component.scss']
})
export class CrewEditorComponent implements OnInit {

  crewFormGroup!: FormGroup;
  userKeys: UserKey[] = [];

  constructor(
    private dialogRef: MatDialogRef<CrewEditorComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {crew: UserKey[], shift: Shift},
    private usersService: UsersService,
    private shiftsService: ShiftsService,
  ) { }

  ngOnInit(): void {
    this.crewFormGroup = this.formBuilder.group({
      crew: this.formBuilder.array(this.data.crew.map(member => this.formBuilder.control({value: member.username, disabled: false})))
    });

    this.usersService.getUserKeys().pipe(
      filter(_userKeys => _userKeys !== null),
      first(),
    ).subscribe(_userKeys => this.userKeys = _userKeys as UserKey[]);
  }

  onCancelClick = () => {
    this.dialogRef.close(false);
  }

  onSubmitClick = () => {
    this.memberValidator();
    if (this.crewFormGroup.valid) {
      const changedCrewUuids = this.getCrewControls().map(_control => {
        const index = this.userKeys.findIndex(_userKey => _userKey.username ===  _control.value);
        return this.userKeys[index].uuid;
      });
      
      console.log(this.data.shift.crewUuids, changedCrewUuids)
      this.data.shift.crewUuids = changedCrewUuids;
      this.shiftsService.updateShift(this.data.shift);
      this.dialogRef.close(true);
    }
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

  private memberValidator = () => {
    const uniqueUsernames: string[] = [];
    this.getCrewControls().forEach(_control => {
      const index = this.userKeys.findIndex(_userKey => _userKey.username === _control.value);
      if (index === -1) {
        _control.setErrors({required: true});
      }
      if (uniqueUsernames.includes(_control.value)) {
        _control.setErrors({notUnique: true});
      } else {
        uniqueUsernames.push(_control.value);
      }
    });
  }
}
