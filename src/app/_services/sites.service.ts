import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Api } from '../_api/mock.api';
import { Site } from '../_interfaces/site.interface';

@Injectable({
  providedIn: 'root',
})
export class SitesService {
  private sites$: BehaviorSubject<Site[] | null> | undefined = undefined;

  constructor(private api: Api) {}

  getSites = (): BehaviorSubject<Site[] | null> => {
    if (this.sites$ === undefined) {
      this.sites$ = new BehaviorSubject<Site[] | null>(null);
      this.api.readSites().then((sites) => {
        this.sites$?.next(sites);
      });
    }
    return this.sites$;
  };

  createSites = (site: Omit<Site, 'uuid' | 'activate'>) => {
    return this.api.createSites(site);
  };

  changeSiteActivation = (site:Site) => {
    return this.api.changeSiteActivation(site);
  };

}
