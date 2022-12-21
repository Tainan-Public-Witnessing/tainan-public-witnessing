import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SiteCreatorComponent } from 'src/app/_elements/dialogs/site-creator/site-creator.component';
import { SiteEditorComponent } from 'src/app/_elements/dialogs/site-editor/site-editor.component';
import { SitesService } from '../../_services/sites.service';
import { Site } from '../../_interfaces/site.interface';
import { Subject, BehaviorSubject, startWith, switchMap, takeUntil } from 'rxjs';
@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss'],
})
export class SiteComponent implements OnInit {
  reloadList$ = new BehaviorSubject<void>(undefined);
  sites$ = new BehaviorSubject<Site[] | null>(null);
  unsubscribe$ = new Subject<void>();
  constructor(
    private sitesService: SitesService,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.reloadList$.pipe(
      startWith(undefined),
      switchMap(() => {
        return this.sitesService
          .getSites()
          .pipe(takeUntil(this.unsubscribe$))
      })
    ).subscribe(sites => {
      this.sites$.next(sites);
    })
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  createSite = () => {
    let creatDiagRef = this.matDialog.open(SiteCreatorComponent, {
      panelClass: 'dialog-panel',
    });
    creatDiagRef.afterClosed().subscribe((result) => {
      if (result === 'success')
        this.sitesService.getSites();
    });
  };

  changeSiteActivation = (site: Site) => {
    this.sites$?.subscribe(sites => {
      let index = sites?.indexOf(site);
      this.sitesService
        .changeSiteActivation(site)
        .then((activation) => (sites![index!].activate = activation));
    });
  };
  openSiteEditor = (site: Site) => {
    let editDiagRef = this.matDialog.open(SiteEditorComponent, {
      panelClass: 'dialog-panel',
      data: {
        site: site,
      },
    });
    editDiagRef.afterClosed().subscribe((result) => {
      if (result === 'success')
        this.sitesService.getSites();
    });
  };
}
