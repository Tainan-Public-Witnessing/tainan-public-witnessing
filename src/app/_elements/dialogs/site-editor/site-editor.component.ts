import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SitesService } from 'src/app/_services/sites.service';
import { Site } from 'src/app/_interfaces/site.interface';
@Component({
  selector: 'app-site-editor',
  templateUrl: '../site-creator/site-creator.component.html',
  styleUrls: ['./site-editor.component.scss'],
})
export class SiteEditorComponent implements OnInit {
  siteform: FormGroup;

  constructor(
    private formbuilder: FormBuilder,
    private sitesService: SitesService,
    private dialogRef: MatDialogRef<SiteEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { site: Site }
  ) {
    this.siteform = this.formbuilder.group({
      uuid: [this.data.site.uuid],
      order: [this.data.site.order],
      position: [this.data.site.position],
      name: [this.data.site.name, Validators.required],
      activate: [this.data.site.activate],
    });
  }

  ngOnInit(): void {}

  onCancelClick = () => {
    this.dialogRef.close();
  };

  onSubmitClick = async () => {
    if (this.siteform.status !== 'VALID') {
      this.siteform.markAllAsTouched();
    } else {
      const { uuid, name, position, activate, order } = this.siteform.value;
      const data = {
        uuid: uuid!,
        position: position!,
        name: name!,
        activate: activate!,
        order: order!,
      };
      await this.sitesService.updateSite(data);
      this.siteform.disable();
      this.dialogRef.close('success');
    }
  };
}
