import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Api } from '../_api/mock.api';
import { PersonalShifts } from '../_interfaces/personal-shifts.interface';

@Injectable({
  providedIn: 'root'
})
export class PersonalShiftsService {

  private personalShifts = new Map<string, BehaviorSubject<PersonalShifts|null|undefined>>();

  constructor(
    private api: Api,
  ) { }

  getPersonalShift = (yearMonth: string, uuid: string): BehaviorSubject<PersonalShifts|null|undefined> => {
    if (!this.personalShifts.has(uuid)) {
      const personalShift$ = new BehaviorSubject<PersonalShifts|null|undefined>(null);
      this.personalShifts.set(uuid, personalShift$);
      this.api.readPersonalShifts(yearMonth, uuid).then(personalShift => {
        personalShift$.next(personalShift);
      }).catch(reason => {
        personalShift$.next(undefined);
      });
    }
    return this.personalShifts.get(uuid) as BehaviorSubject<PersonalShifts|null|undefined>;
  }
}
