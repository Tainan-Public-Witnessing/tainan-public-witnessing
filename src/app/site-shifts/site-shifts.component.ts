import { Component, OnInit, OnDestroy } from '@angular/core';
import { SiteShiftService } from '../_services/site-shifts.service';
import { ShiftHoursService } from '../_services/shift-hours.service';
import {
  BehaviorSubject,
  map,
  filter,
  Subject,
  switchMap,
  from,
  tap,
  partition,
} from 'rxjs';
import { share } from 'rxjs/operators';
import {
  SiteShifts,
  SiteShiftFull,
} from '../_interfaces/site-shifts.interface';
import { ShiftHour } from '../_interfaces/shift-hours.interface';

@Component({
  selector: 'app-site-shifts',
  templateUrl: './site-shifts.component.html',
  styleUrls: ['./site-shifts.component.scss'],
})
export class SiteShiftsComponent implements OnInit, OnDestroy {
  siteShiftsByDay$ = new BehaviorSubject<
    Map<number, SiteShiftFull[] | undefined>
  >(new Map<number, SiteShiftFull[]>());
  shifthours$ = new BehaviorSubject<ShiftHour[] | null>(null);
  days = [0, 1, 2, 3, 4, 5, 6];
  siteUuid: string;
  getSiteUuid$ = new Subject<string>();
  constructor(
    private siteShiftService: SiteShiftService,
    private shiftHoursService: ShiftHoursService
  ) {}

  ngOnInit(): void {
    const readSiteShifts$ = this.getSiteUuid$.pipe(
      switchMap((uuid) =>
        from(this.siteShiftService.getSiteShiftList()).pipe(
          map((siteShifts) => {
            return {
              uuid,
              siteShifts: siteShifts?.filter((x) => x.siteUuid === uuid),
            };
          })
        )
      ),
      filter((data) => data.siteShifts !== undefined),
      switchMap((data) =>
        from(this.shiftHoursService.getShiftHours()).pipe(
          filter((shiftHours) => shiftHours !== null),
          map((shiftHours) => {
            const map = new Map<number, SiteShiftFull[] | undefined>();
            const missingSiteShifts: Omit<
              SiteShifts,
              'uuid' | 'activate' | 'attendance' | 'delivers'
            >[] = [];
            const days = [0, 1, 2, 3, 4, 5, 6];
            days.forEach((day) => {
              const dayShiftFulls: SiteShiftFull[] = [];
              const dayShifts = data.siteShifts?.filter(
                (f) => f.weekday === day
              );
              shiftHours?.forEach((shiftHour) => {
                let exist = dayShifts?.some(
                  (d) => d.shiftHoursUuid === shiftHour.uuid
                );
                if (exist) {
                  let dayShift = dayShifts?.find(
                    (f) => f.shiftHoursUuid === shiftHour.uuid
                  );
                  dayShiftFulls.push({ siteShift: dayShift, shiftHour });
                } else {
                  missingSiteShifts.push({
                    weekday: day,
                    siteUuid: data.uuid,
                    shiftHoursUuid: shiftHour.uuid,
                  });
                }
              });
              map.set(day, dayShiftFulls);
            });
            return { map, missingSiteShifts };
          })
        )
      ),
      share()
    );
    const [ready$, unReady$] = partition(
      readSiteShifts$,
      (data) => data.missingSiteShifts.length === 0
    );
    ready$.subscribe((data) => {
      this.siteShiftsByDay$.next(data.map);
    });
    unReady$
      .pipe(
        tap(() => console.log('Unready')),
        switchMap((data) =>
          from(
            this.siteShiftService.createBatchSiteShifts(data.missingSiteShifts)
          )
        )
      )
      .subscribe(() => {
        this.getSiteUuid$.next(this.siteUuid);
      });
  }

  ngOnDestroy(): void {
    this.getSiteUuid$.complete();
  }

  onSiteSelected(uuid: string) {
    this.siteUuid = uuid;
    this.getSiteUuid$.next(this.siteUuid);
  }
}
