import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Api } from '../_api/mock.api';
import { Site } from '../_interfaces/site.interface';

@Injectable({
  providedIn: 'root'
})
export class SitesService {

  private sites$ = new BehaviorSubject<Site[]|null>(null);

  constructor(
    private api: Api,
  ) { }

  getSites = (): BehaviorSubject<Site[]|null> => {
    if (!this.sites$.value) {
      this.api.readSites().then(sites => {
        this.sites$.next(sites);
      });
    }
    return this.sites$;
  }
}
