import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Api } from '../_api/mock.api';
import { getPersonalShiftUuidByUserUuidAndYearMonth, PersonalShift } from '../_interfaces/personal-shift.interface';

@Injectable({
  providedIn: 'root'
})
export class PersonalShiftsService {

  private personalShifts = new Map<string, BehaviorSubject<PersonalShift|null|undefined>>();

  constructor(
    private api: Api,
  ) { }

  getPersonalShift = (userUuid: string, yearMonth: string): BehaviorSubject<PersonalShift|null|undefined> => {
    const uuid = getPersonalShiftUuidByUserUuidAndYearMonth(userUuid, yearMonth);
    if (!this.personalShifts.has(uuid)) {
      const personalShift$ = new BehaviorSubject<PersonalShift|null|undefined>(null);
      this.personalShifts.set(uuid, personalShift$);
      this.api.readPersonalShift(uuid).then(personalShift => {
        personalShift$.next(personalShift);
      }).catch(reason => {
        if (reason === 'NOT_EXIST') {
          personalShift$.next(undefined);
        }
      });
    }
    return this.personalShifts.get(uuid);
  }
}
