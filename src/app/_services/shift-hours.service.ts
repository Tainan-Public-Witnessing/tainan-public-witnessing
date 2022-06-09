import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Api } from '../_api/mock.api';
import { ShiftHours } from '../_interfaces/shift-hours.interface';

@Injectable({
  providedIn: 'root'
})
export class ShiftHoursService {

  private shiftHours$ = new BehaviorSubject<ShiftHours[]|null>(null);

  constructor(
    private api: Api,
  ) { }

  getShiftHoursList = (): BehaviorSubject<ShiftHours[]|null> => {
    if (!this.shiftHours$.value) {
      this.api.readShiftHoursList().then(shiftHours => {
        this.shiftHours$.next(shiftHours);
      });
    }
    return this.shiftHours$;
  }
}
