import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Mode } from 'src/app/_enums/mode.enum';
import { Status } from 'src/app/_enums/status.enum';
import { Tag } from 'src/app/_interfaces/tag.interface';
import { TagsService } from 'src/app/_services/tags.service';
import { TagDialogData } from './tag-dialog-data.interface';

@Component({
  selector: 'app-tag-dialog',
  templateUrl: './tag-dialog.component.html',
  styleUrls: ['./tag-dialog.component.scss']
})
export class TagDialogComponent implements OnInit {

  title: string;
  tagControl: UntypedFormControl;

  constructor(
    private dialogRef: MatDialogRef<TagDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: TagDialogData,
    private tagService: TagsService
  ) { }

  ngOnInit(): void {

    this.title = this.data.mode === Mode.CREATE ? 'TAGS.CREATE_TITLE' : 'TAGS.EDIT_TITLE';

    this.tagControl = new UntypedFormControl('', Validators.required);

    if (this.data.mode === Mode.UPDATE) {
      this.tagControl.setValue(this.data.tag.name);
    }
  }

  onSubmitClick = () => {
    if (this.tagControl.status === 'VALID') {

      let response: Promise<Status>;
      const value = this.tagControl.value.trim();

      if (this.data.mode === Mode.CREATE) {
        response = this.tagService.createTag({
          uuid: null,
          name: value,
          order: 0
        });
      } else { // EDIT mode
        if (this.tagControl.dirty) {
          response = this.tagService.updateTag({
            uuid: this.data.tag.uuid,
            name: value,
            order: this.data.tag.order
          });
        } else { // no changes
          response = Promise.resolve(Status.NO_CHANGES);
        }
      }

      response.then(() => {
        this.dialogRef.close(null);
      }).catch(reason => {
        if (reason === Status.EXISTED) {
          this.tagControl.setErrors({existed: true});
        }
      });
    } else {
      this.tagControl.markAllAsTouched();
    }
  }

  onCancelClick = () => {
    this.dialogRef.close(null);
  }
}
