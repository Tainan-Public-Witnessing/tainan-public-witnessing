import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tag } from 'src/app/_interfaces/tag.interface';
import { TagsService } from 'src/app/_services/tags.service';
import { TagDialogData } from './tag-dialog-data.interface';

@Component({
  selector: 'app-tag-dialog',
  templateUrl: './tag-dialog.component.html',
  styleUrls: ['./tag-dialog.component.scss']
})
export class TagDialogComponent implements OnInit {

  mode: string;
  title: string;
  tagControl: FormControl;

  constructor(
    private dialogRef: MatDialogRef<TagDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: TagDialogData,
    private tagService: TagsService
  ) { }

  ngOnInit(): void {

    this.mode = this.data.mode;

    this.title = this.mode === 'CREATE' ? 'Create tag' : 'Edit tag';

    this.tagControl = new FormControl('', Validators.required);

    if (this.mode === 'EDIT') {
      this.tagControl.setValue(this.data.tag.name);
    }
  }

  onSubmitClick = () => {
    if (this.tagControl.status === 'VALID') {
      let response: Promise<string>;

      if (this.mode === 'CREATE') {
        response = this.tagService.createTag({
          uuid: null,
          name: this.tagControl.value
        });
      } else { // EDIT mode
        if (this.data.tag.name !== this.tagControl.value) {
          response = this.tagService.updateTag({
            uuid: this.data.tag.uuid,
            name: this.tagControl.value
          });
        } else { // no changes
          response = Promise.resolve('NO_CHANGES');
        }
      }

      response.then(() => {
        this.dialogRef.close(null);
      }).catch(reason => {
        if (reason === 'TAG_NAME_EXISTED') {
          this.tagControl.setErrors({existed: true});
        }
      });
    }
  }

  onCancelClick = () => {
    this.dialogRef.close(null);
  }
}
