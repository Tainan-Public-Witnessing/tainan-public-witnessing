import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { SitesService } from 'src/app/_services/sites.service';
import { Site } from 'src/app/_interfaces/site.interface';
@Component({
  selector: 'app-site-editor',
  templateUrl: './site-editor.component.html',
  styleUrls: ['./site-editor.component.scss'],
})
export class SiteEditorComponent implements OnInit {
  siteform = this.formbuilder.group({
    uuid: [this.data.site.uuid],
    order: [this.data.site.order],
    position: [this.data.site.position],
    name: [this.data.site.name, Validators.required],
    activate: [this.data.site.activate],
  });

  constructor(
    private formbuilder: FormBuilder,
    private sitesService: SitesService,
    private dialogRef: MatDialogRef<SiteEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { site: Site }
  ) {}

  ngOnInit(): void {}

  onCancelClick = () => {
    this.dialogRef.close(false);
  };

  onSubmitClick = () => {
    const { uuid, name, position, activate, order } = this.siteform.value;
    const data = {
      uuid: uuid!,
      position: position!,
      name: name!,
      activate: activate!,
      order: order!,
    };
    this.sitesService.updateSites(data);
    this.dialogRef.close(true);
  };
}
