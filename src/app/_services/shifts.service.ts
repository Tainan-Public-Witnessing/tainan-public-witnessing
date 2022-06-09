import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Api } from '../_api/mock.api';
import { Shift, ShiftKey } from '../_interfaces/shift.interface';

@Injectable({
  providedIn: 'root'
})
export class ShiftsService {

  private shiftKeys = new Map<string, BehaviorSubject<ShiftKey[]|null|undefined>>(); // key: yyyy-MM | yyyy-MM-dd
  private shifts = new Map<string, BehaviorSubject<Shift|null|undefined>>();

  constructor(
    private api: Api
  ) { }

  getShiftKeysByMonth = (yearMonth: string): BehaviorSubject<ShiftKey[]|null> => { // yyyy-MM
    if (!this.shiftKeys.has(yearMonth)) {
      const shiftKeys$ = new BehaviorSubject<ShiftKey[]|null|undefined>(null);
      this.shiftKeys.set(yearMonth, shiftKeys$);
      this.api.readShiftKeysByMonth(yearMonth).then(shiftKeys => {
        shiftKeys$.next(shiftKeys);
      });
    }
    return this.shiftKeys.get(yearMonth);
  }

  getShiftKeysByDate = (date: string): BehaviorSubject<ShiftKey[]|null> => { // yyyy-MM-dd
    if (!this.shiftKeys.has(date)) {
      const shiftKeys$ = new BehaviorSubject<ShiftKey[]|null|undefined>(null);
      this.shiftKeys.set(date, shiftKeys$);
      const yearMonth = date.slice(0, 6); // yyyy-MM
      if (this.shiftKeys.has(yearMonth)) {
        shiftKeys$.next(this.shiftKeys.get(yearMonth)?.value.filter(shiftKey => shiftKey.date === date));
      } else {
        this.api.readShiftKeysByDate(date).then(shiftKeys => {
          shiftKeys$.next(shiftKeys);
        });
      }
    }
    return this.shiftKeys.get(date);
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
    return this.shifts.get(uuid);
  }

  getShiftsByUuids = (uuids: string[]): BehaviorSubject<Shift|null|undefined>[] => {
    const uuidsForApi = uuids.filter(uuid => !this.shifts.has(uuid));
    if (uuidsForApi.length > 0) {
      uuidsForApi.forEach(uuid => {
        const shift$ = new BehaviorSubject<Shift|null|undefined>(null);
        this.shifts.set(uuid, shift$);
      });
      this.api.readShifts(uuidsForApi).then(shifts => {
        shifts.forEach(_shift => this.shifts.get(_shift.uuid).next(_shift));
      });
    }
    return uuids.map(uuid => this.shifts.get(uuid));
  }
}
