import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SiteEditorComponent } from 'src/app/_elements/dialogs/site-editor/site-editor.component';
import { SitesService } from '../../_services/sites.service';
import { Site } from '../../_interfaces/site.interface';
@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss'],
})
export class SiteComponent implements OnInit {
  sites$: Site[] | null = [];

  constructor(
    private sitesService: SitesService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.sitesService.getSites().subscribe((sites) => (this.sites$ = sites));
  }
  createSite = () => {
    this.sitesService
      .createSites({ name: '新地點', position: '', order: this.sites$!.length })
      .then((site) => this.sites$?.push(site));
  };

  changeSiteActivation = (site: Site) => {
    let index = this.sites$?.indexOf(site);
    this.sitesService
      .changeSiteActivation(site)
      .then((activation) => (this.sites$![index!].activate = activation));
  };
  opneSiteEditor = (site:Site) => {
    this.matDialog.open(SiteEditorComponent,{
      panelClass: 'dialog-panel',
      data:{
        site:site
      }
    });
  };
}
