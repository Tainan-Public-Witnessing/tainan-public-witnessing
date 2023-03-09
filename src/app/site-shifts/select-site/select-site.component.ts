import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { SitesService } from '../../_services/sites.service';
import { Site } from '../../_interfaces/site.interface';
import {
  Subject,
  BehaviorSubject,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-select-site',
  templateUrl: './select-site.component.html',
  styleUrls: ['./select-site.component.scss'],
})
export class SelectSiteComponent implements OnInit, OnDestroy {
  reloadList$ = new BehaviorSubject<void>(undefined);
  sites$ = new BehaviorSubject<Site[] | null>(null);
  unsubscribe$ = new Subject<void>();

  constructor(private sitesService: SitesService) {}
  ngOnInit(): void {
    this.reloadList$
      .pipe(
        startWith(undefined),
        switchMap(() => {
          return this.sitesService.getSites().pipe(
            filter((f) => f !== null),
            takeUntil(this.unsubscribe$)
          );
        })
      )
      .subscribe((sites) => {
        this.sites$.next(sites);
      });
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
