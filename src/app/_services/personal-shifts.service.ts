import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Api } from '../_api/mock.api';
import { PersonalShift } from '../_interfaces/personal-shift.interface';

@Injectable({
  providedIn: 'root'
})
export class PersonalShiftsService {

  private personalShifts = new Map<string, BehaviorSubject<PersonalShift|null|undefined>>();

  constructor(
    private api: Api,
  ) { }

  getPersonalShift = (yearMonth: string, uuid: string): BehaviorSubject<PersonalShift|null|undefined> => {
    if (!this.personalShifts.has(uuid)) {
      const personalShift$ = new BehaviorSubject<PersonalShift|null|undefined>(null);
      this.personalShifts.set(uuid, personalShift$);
      this.api.readPersonalShift(yearMonth, uuid).then(personalShift => {
        personalShift$.next(personalShift);
      }).catch(reason => {
        if (reason === 'NOT_EXIST') {
          personalShift$.next(undefined);
        }
      });
    }
    return this.personalShifts.get(uuid) as BehaviorSubject<PersonalShift|null|undefined>;
  }
}
