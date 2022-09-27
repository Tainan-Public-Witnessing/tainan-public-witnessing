import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { first, filter, map } from 'rxjs/operators';
import { Api } from '../_api/mock.api';
import { Shift } from '../_interfaces/shift.interface';
import { SiteShifts } from '../_interfaces/site-shifts.interface';

@Injectable({
  providedIn: 'root',
})
export class SiteShiftService {
  constructor(private api: Api) {}

  getSiteShiftList = () => {
    const $ = new BehaviorSubject<SiteShifts[]>([]);
    this.api.readSiteShifts().then((data) => $.next(data));
    return $;
  };
}
