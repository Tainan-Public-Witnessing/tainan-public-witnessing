import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Api } from "../_api";
import { SiteShifts } from "../_interfaces/site-shifts.interface";

@Injectable({
  providedIn: "root",
})
export class SiteShiftService {
  constructor(private api: Api) {}

  private siteShifts$: BehaviorSubject<SiteShifts[] | null> | undefined = undefined;

  getSiteShiftList = () => {
    if (this.siteShifts$ === undefined) {
      this.siteShifts$ = new BehaviorSubject<SiteShifts[] | null>(null);
      this.api.readSiteShifts().then((data) => this.siteShifts$?.next(data));
    }
    return this.siteShifts$;
  };
  createBatchSiteShifts = (
    siteShifts: Omit<SiteShifts, "uuid" | "activate" | "attendance" | "delivers">[]
  ) => {
    this.siteShifts$?.complete();
    this.siteShifts$ = undefined;
    return this.api.createSiteShifts(siteShifts);
  };

  updateSiteShift = (siteShift: SiteShifts) => {
    this.siteShifts$?.complete();
    this.siteShifts$ = undefined;
    return this.api.updateSiteShift(siteShift);
  };
}
