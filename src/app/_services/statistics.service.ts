import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { Api } from '../_api';
import { Statistic } from '../_interfaces/statistic.interface';
import { ShiftsService } from './shifts.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private statistics = new Map<string, BehaviorSubject<Statistic|null|undefined>>();

  constructor(
    private api: Api,
    private shiftsService: ShiftsService,
  ) { }

  getStatistic = (yearMonth: string, uuid: string): BehaviorSubject<Statistic|null|undefined> => {
    if (!this.statistics.has(uuid)) {
      const statistic$ = new BehaviorSubject<Statistic|null|undefined>(null);
      this.statistics.set(uuid, statistic$);
      this.api.readStatistic(yearMonth, uuid).then(statistic => {
        statistic$.next(statistic);
      }).catch(reason => {
        statistic$.next(undefined);
      });
    }
    return this.statistics.get(uuid) as BehaviorSubject<Statistic|null|undefined>;
  }

  createStatistic = (statistic: Statistic): Promise<void> => {
    const yearMonth = statistic.date.slice(0, 7);
    return firstValueFrom(
      this.shiftsService.getShiftByUuid(yearMonth, statistic.uuid).pipe(
        filter(_shift => _shift !== null),
        first(),
      )
    ).then(_shift => {
      if (_shift && !_shift.hasStatistic) {
        return this.api.createStatistic(statistic).then(() => {
          if (!this.statistics.has(statistic.uuid)) {
            const statistic$ = new BehaviorSubject<Statistic|null|undefined>(null);
            this.statistics.set(statistic.uuid, statistic$);
          }
          this.statistics.get(statistic.uuid)?.next(statistic);
          _shift.hasStatistic = true;
          this.api.updateShift(_shift);
        });
      } else {
        return Promise.reject();
      }
    });
  }

  updateStatistic = (statistic: Statistic): Promise<void> => {
    const yearMonth = statistic.date.slice(0, 7);
    return firstValueFrom(
      this.shiftsService.getShiftByUuid(yearMonth, statistic.uuid).pipe(
        filter(_shift => _shift !== null),
        first(),
      )
    ).then(_shift => {
      if (_shift && _shift.hasStatistic) {
        return this.api.updateStatistic(statistic).then(() => {
          if (!this.statistics.has(statistic.uuid)) {
            const statistic$ = new BehaviorSubject<Statistic|null|undefined>(null);
            this.statistics.set(statistic.uuid, statistic$);
          } else {
            this.statistics.get(statistic.uuid)?.next(statistic);
          }
        });
      } else {
        return Promise.reject();
      }
    });
  }
}
