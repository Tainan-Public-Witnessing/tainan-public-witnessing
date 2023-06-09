import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Api } from '../_api';
import { ShiftHour } from '../_interfaces/shift-hours.interface';

@Injectable({
  providedIn: 'root',
})
export class ShiftHoursService {
  private shiftHours$: BehaviorSubject<ShiftHour[] | null> | undefined =
    undefined;

  constructor(private api: Api) {}

  getShiftHours = (): BehaviorSubject<ShiftHour[] | null> => {
    if (this.shiftHours$ === undefined) {
      this.shiftHours$ = new BehaviorSubject<ShiftHour[] | null>(null);
      this.api.readShiftHours().then((shiftHours) => {
        let shiftHoursSort = shiftHours.sort((a, b) =>
          a.startTime.localeCompare(b.startTime)
        );
        this.shiftHours$?.next(shiftHoursSort);
      });
    }
    return this.shiftHours$;
  };

  createShiftHours = (
    shifthours: Omit<ShiftHour, 'uuid' | 'activate' | 'deliver'>
  ) => {
    this.shiftHours$?.complete();
    this.shiftHours$ = undefined;
    return this.api.createShiftHour(shifthours);
  };
  updateShiftHours = (shiftHour: ShiftHour) => {
    this.shiftHours$?.complete();
    this.shiftHours$ = undefined;
    return this.api.updateShiftHour(shiftHour);
  };

  changeShiftHourActivation = (shifthour: ShiftHour) => {
    this.shiftHours$?.complete();
    this.shiftHours$ = undefined;
    return this.api.changeShiftHourActivation(shifthour);
  };

  changeShiftHourDelivery = (shifthour: ShiftHour) => {
    this.shiftHours$?.complete();
    this.shiftHours$ = undefined;
    return this.api.changeShiftHourDelivery(shifthour);
  };
}
