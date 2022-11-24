import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Api } from '../_api';
import { ShiftHours } from '../_interfaces/shift-hours.interface';

@Injectable({
  providedIn: 'root'
})
export class ShiftHoursService {

  private shiftHours$: BehaviorSubject<ShiftHours[] | null> | undefined = undefined;

  constructor(
    private api: Api,
  ) { }

  getShiftHoursList = (): BehaviorSubject<ShiftHours[] | null> => {
    if (this.shiftHours$ === undefined) {
      this.shiftHours$ = new BehaviorSubject<ShiftHours[] | null>(null);
    }
    this.api.readShiftHoursList().then(shiftHours => {
      this.shiftHours$?.next(shiftHours);
    });
    return this.shiftHours$;
  }

  createShiftHours = (shifthours: Omit<ShiftHours, 'uuid' | 'activate' | 'deliver'>) => {
    return this.api.createShiftHours(shifthours);
  }
  updateShiftHours = (shiftHour: ShiftHours) => {
    return this.api.updateShiftHours(shiftHour);
  };

  changeShiftHourActivation = (shifthour: ShiftHours) => {
    return this.api.changeShiftHourActivation(shifthour);
  };

  changeShiftHourDelivery = (shifthour: ShiftHours) => {
    return this.api.changeShiftHourDelivery(shifthour);
  };

}
