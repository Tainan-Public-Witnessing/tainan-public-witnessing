import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SiteCreatorComponent } from 'src/app/_elements/dialogs/site-creator/site-creator.component';
import { SiteEditorComponent } from 'src/app/_elements/dialogs/site-editor/site-editor.component';
import { SitesService } from '../../_services/sites.service';
import { Site } from '../../_interfaces/site.interface';
@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss'],
})
export class SiteComponent implements OnInit {
  sites: Site[] | null = [];
  constructor(
    private sitesService: SitesService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.sitesService.getSites().subscribe((sites) => (this.sites = sites));
  }
  createSite = () => {
    let creatDiagRef = this.matDialog.open(SiteCreatorComponent, {
      panelClass: 'dialog-panel',
    });
    creatDiagRef.afterClosed().subscribe((result) => {
      if (result === 'success')
        this.sitesService.getSites().subscribe((sites) => (this.sites = sites));
    });
  };

  changeSiteActivation = (site: Site) => {
    let index = this.sites?.indexOf(site);
    this.sitesService
      .changeSiteActivation(site)
      .then((activation) => (this.sites![index!].activate = activation));
  };
  opneSiteEditor = (site: Site) => {
    let editDiagRef = this.matDialog.open(SiteEditorComponent, {
      panelClass: 'dialog-panel',
      data: {
        site: site,
      },
    });
    editDiagRef.afterClosed().subscribe((result) => {
      if (result === 'success')
        this.sitesService.getSites().subscribe((sites) => (this.sites = sites));
    });
  };
}
