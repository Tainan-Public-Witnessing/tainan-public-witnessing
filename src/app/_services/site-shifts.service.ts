import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Api } from '../_api';
import { SiteShifts } from '../_interfaces/site-shifts.interface';

@Injectable({
  providedIn: 'root',
})
export class SiteShiftService {
  constructor(private api: Api) {}

  cache$ = new BehaviorSubject<SiteShifts[] | null>(null);

  getSiteShiftList = () => {
    if (!this.cache$.value) {
      this.api.readSiteShifts().then((data) => this.cache$.next(data));
    }
    return this.cache$;
  };
}
