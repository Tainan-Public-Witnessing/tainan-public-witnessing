import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Api } from '../_api';
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
        let sitesSort = sites.sort((a, b) => a.order - b.order);
        this.sites$?.next(sitesSort);
      });
    }
    return this.sites$;
  };

  createSite = (site: Omit<Site, 'uuid' | 'activate' | 'order'>) => {
    this.sites$?.complete();
    this.sites$ = undefined;
    return this.api.createSite(site);
  };

  changeSiteActivation = (site: Site) => {
    this.sites$?.complete();
    this.sites$ = undefined;
    return this.api.changeSiteActivation(site);
  };
  updateSite = (site: Site) => {
    this.sites$?.complete();
    this.sites$ = undefined;
    return this.api.updateSite(site);
  };
}
