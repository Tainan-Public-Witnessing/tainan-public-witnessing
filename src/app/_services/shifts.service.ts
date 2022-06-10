import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { first, filter, map } from 'rxjs/operators';
import { Api } from '../_api/mock.api';
import { Shift } from '../_interfaces/shift.interface';

@Injectable({
  providedIn: 'root'
})
export class ShiftsService {

  private shiftSets = new Map<string, BehaviorSubject<Shift[]|null|undefined>>()
  private shifts = new Map<string, BehaviorSubject<Shift|null|undefined>>();

  constructor(
    private api: Api
  ) { }

  getShiftsByMonth = (yearMonth: string): BehaviorSubject<Shift[]|null|undefined> => { // yyyy-MM
    if (!this.shiftSets.has(yearMonth)) {
      const shifts$ = new BehaviorSubject<Shift[]|null|undefined>(null);
      this.shiftSets.set(yearMonth, shifts$);
      this.api.readShiftsByMonth(yearMonth).then(shifts => {
        shifts$.next(shifts);
        shifts.forEach(_shift => this.addShiftToCache(_shift));
      }).catch(reason => {
        if (reason === 'NOT_EXIST') {
          shifts$.next(undefined);
        }
      });
    }
    return this.shiftSets.get(yearMonth) as BehaviorSubject<Shift[]|null|undefined>;
  }

  getShiftsByDate = (date: string): BehaviorSubject<Shift[]|null|undefined> => { // yyyy-MM-dd
    if (!this.shiftSets.has(date)) {
      const shifts$ = new BehaviorSubject<Shift[]|null|undefined>(null);
      this.shiftSets.set(date, shifts$);

      const yearMonth = date.slice(0, 6); // yyyy-MM
      if (this.shiftSets.has(yearMonth)) {
        this.shiftSets.get(yearMonth)?.pipe(
          filter(_shiftSet => _shiftSet !== null),
          first(),
          map(_shiftSet => _shiftSet?.filter(_shift => _shift.date === date)),
          map(_shiftSet => _shiftSet as Shift[]),
        ).subscribe(_shiftSet => {
          if (_shiftSet.length > 0) {
            shifts$.next(_shiftSet);
          } else {
            shifts$.next(undefined);
          }
        });
      } else {
        this.api.readShiftsByDate(date).then(shifts => {
          shifts$.next(shifts);
          shifts.forEach(_shift => this.addShiftToCache(_shift));
        }).catch(reason => {
          if (reason === 'NOT_EXIST') {
            shifts$.next(undefined);
          }
        });
      }
    }
    return this.shiftSets.get(date) as BehaviorSubject<Shift[]|null|undefined>;
  }

  getShiftsByUuids = (uuids: string[]): BehaviorSubject<Shift|null|undefined>[] => {
    const uuidsForApi = uuids.filter(uuid => !this.shifts.has(uuid));
    if (uuidsForApi.length > 0) {
      uuidsForApi.forEach(uuid => {
        const shift$ = new BehaviorSubject<Shift|null|undefined>(null);
        this.shifts.set(uuid, shift$);
      });
      this.api.readShifts(uuidsForApi).then(shifts => {
        uuidsForApi.forEach(uuid => {
          const index = shifts.findIndex(_shift => _shift.uuid === uuid);
          const shift$ = this.shifts.get(uuid);
          if (index > -1) {
            shift$?.next(shifts[index]);
          } else {
            shift$?.next(undefined);
          }
        });
      });
    }
    return uuids.map(uuid => this.shifts.get(uuid) as BehaviorSubject<Shift|null|undefined>);
  }

  getShiftByUuid = (uuid: string): BehaviorSubject<Shift|null|undefined> => {
    if (!this.shifts.has(uuid)) {
      const shift$ = new BehaviorSubject<Shift|null|undefined>(null);
      this.shifts.set(uuid, shift$);
      this.api.readShift(uuid).then(shift => {
        shift$.next(shift);
      }).catch(reason => {
        if (reason === 'NOT_EXIST') {
          shift$.next(undefined);
        }
      });
    }
    return this.shifts.get(uuid) as BehaviorSubject<Shift|null|undefined>;
  }

  private addShiftToCache = (shift: Shift|undefined) => {
    if (shift !== undefined) {
      if (!this.shifts.has(shift.uuid)) {
        const shift$ = new BehaviorSubject<Shift|null|undefined>(null);
        this.shifts.set(shift.uuid, shift$)
      }
      this.shifts.get(shift.uuid)?.next(shift);
    }
  }
}
