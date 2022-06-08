import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Api } from '../_api/mock.api';
import { Shift, ShiftKey } from '../_interfaces/shift.interface';

@Injectable({
  providedIn: 'root'
})
export class ShiftsService {

  private shiftKeys = new Map<string, BehaviorSubject<ShiftKey[]|null|undefined>>();
  private shifts = new Map<string, BehaviorSubject<Shift|null|undefined>>();

  constructor(
    private api: Api
  ) { }

  getShiftKeys = (yearMonth: string): BehaviorSubject<ShiftKey[]|null> => { // yyyy-MM
    if (!this.shiftKeys.has(yearMonth)) {
      const shiftKeys$ = new BehaviorSubject<ShiftKey[]|null|undefined>(null);
      this.shiftKeys.set(yearMonth, shiftKeys$);
      this.api.readShiftKeys(yearMonth).then(shiftKeys => {
        shiftKeys$.next(shiftKeys);
      });
    }
    return this.shiftKeys.get(yearMonth);
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
}
