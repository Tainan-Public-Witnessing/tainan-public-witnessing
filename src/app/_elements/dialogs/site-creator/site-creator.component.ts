import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SitesService } from 'src/app/_services/sites.service';
import { Site } from 'src/app/_interfaces/site.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-site-creator',
  templateUrl: './site-creator.component.html',
  styleUrls: ['./site-creator.component.scss'],
})
export class SiteCreatorComponent implements OnInit {
  siteform: FormGroup;

  constructor(
    private formbuilder: FormBuilder,
    private sitesService: SitesService,
    private dialogRef: MatDialogRef<SiteCreatorComponent>
  ) {
    this.siteform = this.formbuilder.group({
      position: [],
      name: ['', Validators.required],
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
      const { name, position } = this.siteform.value;
      const site: Omit<Site, 'uuid' | 'activate' | 'order'> = {
        name,
        position,
      };
      await this.sitesService.createSite(site);
      this.siteform.disable();
      this.dialogRef.close('success');
    }
  };
}
