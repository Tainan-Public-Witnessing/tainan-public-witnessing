import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Api } from '../_api';
import { PersonalShifts } from '../_interfaces/personal-shifts.interface';

@Injectable({
  providedIn: 'root'
})
export class PersonalShiftsService {

  private personalShifts = new Map<string, BehaviorSubject<PersonalShifts|null|undefined>>();

  constructor(
    private api: Api,
  ) { }

  getPersonalShifts = (yearMonth: string, uuid: string): BehaviorSubject<PersonalShifts|null|undefined> => {
    const key = [uuid, yearMonth].join('_');
    if (!this.personalShifts.has(key)) {
      const personalShifts$ = new BehaviorSubject<PersonalShifts|null|undefined>(null);
      this.personalShifts.set(key, personalShifts$);
      this.api.readPersonalShifts(yearMonth, uuid).then(personalShift => {
        personalShifts$.next(personalShift);
      }).catch(reason => {
        personalShifts$.next(undefined);
      });
    }
    return this.personalShifts.get(key) as BehaviorSubject<PersonalShifts|null|undefined>;
  }

  createPersonalShifts = (yearMonth: string, personalShifts: PersonalShifts): Promise<void> => {
    const key = [personalShifts.uuid, yearMonth].join('_');
    if (!this.personalShifts.has(key)) {
      const personalShifts$ = new BehaviorSubject<PersonalShifts|null|undefined>(null);
      this.personalShifts.set(key, personalShifts$);
    }
    this.personalShifts.get(key)?.next(personalShifts);
    return this.api.createPersonalShifts(yearMonth, personalShifts);
  }

  updatePersonalShifts = (yearMonth: string, personalShifts: PersonalShifts): Promise<void> => {
    const key = [personalShifts.uuid, yearMonth].join('_');
    if (!this.personalShifts.has(key)) {
      const personalShifts$ = new BehaviorSubject<PersonalShifts|null|undefined>(null);
      this.personalShifts.set(key, personalShifts$);
    }
    this.personalShifts.get(key)?.next(personalShifts);
    return this.api.updatePersonalShifts(yearMonth, personalShifts);
  }
}
