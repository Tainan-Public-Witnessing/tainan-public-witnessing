import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { __values } from 'tslib';
import { Api } from '../_api/mock.api';
import { Site } from '../_interfaces/site.interface';

@Injectable({
  providedIn: 'root',
})
export class SitesService {
  private sites$: BehaviorSubject<Site[] | null> | undefined = undefined;

  constructor(private api: Api) { }

  getSites = (): BehaviorSubject<Site[] | null> => {
    if (this.sites$ === undefined) {
      this.sites$ = new BehaviorSubject<Site[] | null>(null);
    }
    this.api.readSites().then((sites) => {
      console.log(sites);
      this.sites$?.next(sites);
    });

    return this.sites$;
  };

  createSite = (site: Omit<Site, 'uuid' | 'activate' | 'order'>) => {
    return this.api.createSite(site);
    // this.api.createSite(site).then((uuid) => {
    //   this.sites$?.next([...(this.sites$.value || []), { ...site, uuid }]);
    // });

    // return this.sites$;
  };

  changeSiteActivation = (site: Site) => {
    return this.api.changeSiteActivation(site);
  };
  updateSites = (site: Site) => {
    this.api.updateSites(site).then(() => {
      const updatedSites = this.sites$?.value?.map((_site) => {
        return _site.uuid === site.uuid
          ? { ..._site, name: site.name, position: site.position }
          : _site;
      });
      this.sites$?.next(updatedSites!);
    });
  };
}
