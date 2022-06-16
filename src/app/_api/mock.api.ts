import { Injectable } from '@angular/core';
import { ApiInterface } from 'src/app/_api/api.interface';
import { User, UserKey } from '../_interfaces/user.interface';
import { Congregation } from '../_interfaces/congregation.interface';
import { Site } from '../_interfaces/site.interface';
import { ShiftHours } from '../_interfaces/shift-hours.interface';
import { Shift } from '../_interfaces/shift.interface';
import { PersonalShift } from '../_interfaces/personal-shift.interface';
import { Statistic } from '../_interfaces/statistic.interface';
import { firstValueFrom, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { ACCOUNTS, CONGREGATIONS, PERSONAL_SHIFTS, SHIFTS, SHIFT_HOURS_LIST, SITES, STATISTICS, USERS, USER_KEYS } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class Api implements ApiInterface {

  private accounts: {uuid: string, password: string}[] = ACCOUNTS;
  private userKeys: UserKey[] = USER_KEYS;
  private users: User[] = USERS;
  private congregations: Congregation[] = CONGREGATIONS;
  private sites: Site[] = SITES;
  private shiftHoursList: ShiftHours[] = SHIFT_HOURS_LIST;
  private shifts: Shift[] = SHIFTS;
  private personalShifts: PersonalShift[] = PERSONAL_SHIFTS;
  private statistics: Statistic[] = STATISTICS;

  login = (uuid: string, password: string): Promise<void> => {
    console.log('mock api login', {uuid, password});
    const index = this.accounts.findIndex(account => account.uuid === uuid);
    if (index > -1 && this.accounts[index].password === password) {
      return this.delayReturn();
    } else {
      return this.delayReturn().then(() => Promise.reject());
    }
  };

  logout = (): Promise<void> => {
    console.log('mock api logout');
    return this.delayReturn();
  };

  readUserKeys = (): Promise<UserKey[]> => {
    console.log('mock api readUserKeys');
    return this.delayReturn().then(() => [...this.userKeys]);
  };

  readUser = (uuid: string): Promise<User> => {
    console.log('mock api readUser', {uuid});
    const index = this.users.findIndex(user => user.uuid === uuid);
    if (index > -1) {
      return this.delayReturn().then(() => Object.assign({}, this.users[index]));
    } else {
      return this.delayReturn().then(() => Promise.reject());
    }
  };

  readCongregations = (): Promise<Congregation[]> => {
    console.log('mock api readCongregations');
    return this.delayReturn().then(() => [...this.congregations]);
  };

  readSites = (): Promise<Site[]> => {
    console.log('mock api readSites');
    return this.delayReturn().then(() => [...this.sites]);
  };

  readShiftHoursList = (): Promise<ShiftHours[]> => {
    console.log('mock api readShiftHoursList');
    return this.delayReturn().then(() => [...this.shiftHoursList]);
  };

  readShiftsByMonth = (yearMonth: string): Promise<Shift[]> => {
    console.log('mock api readShiftsByMonth', {yearMonth});
    const _shifts = this.shifts.filter(_shift => _shift.date.includes(yearMonth));
    if (_shifts.length > 0) {
      return this.delayReturn().then(() => [..._shifts]);
    } else  {
      return this.delayReturn().then(() => Promise.reject());
    }
  };

  readShiftsByDate = (date: string): Promise<Shift[]> => {
    console.log('mock api readShiftsByDate', {date});
    const _shifts = this.shifts.filter(_shift => _shift.date === date);
    if (_shifts.length > 0) {
      return this.delayReturn().then(() => [..._shifts]);
    } else  {
      return this.delayReturn().then(() => Promise.reject());
    }
  };

  readShifts = (yearMonth: string, uuids: string[]): Promise<Shift[]> => {
    console.log('mock api readShifts', {yearMonth, uuids});
    const shiftsInYearMonth = this.shifts.filter(_shift => _shift.date.includes(yearMonth));
    const _shifts = uuids.map(uuid => {
      const index = shiftsInYearMonth.findIndex(_shift => _shift.uuid === uuid);
      if (index > -1) {
        return shiftsInYearMonth[index];
      } else {
        return undefined;
      }
    }).filter(_shift => _shift !== undefined) as Shift[];
    if (_shifts.length > 0) {
      return this.delayReturn().then(() => [..._shifts]);
    } else {
      return this.delayReturn().then(() => Promise.reject());
    }
  };

  readShift = (yearMonth: string, uuid: string): Promise<Shift> => {
    console.log('mock api readShift', {yearMonth, uuid});
    const shiftsInYearMonth = this.shifts.filter(_shift => _shift.date.includes(yearMonth));
    const index = shiftsInYearMonth.findIndex(_shift => _shift.uuid === uuid);
    if (index > -1) {
      return this.delayReturn().then(() => Object.assign({}, shiftsInYearMonth[index]));
    } else {
      return this.delayReturn().then(() => Promise.reject());
    }
  };

  updateShift = (shift: Shift): Promise<void> => {
    console.log('mock api updateShift', {shift});
    const index = this.shifts.findIndex(_shifts=> _shifts.uuid === shift.uuid);
    if (index > -1) {
      this.shifts.splice(index, 1);
      this.shifts.push(shift);
      return this.delayReturn();
    } else {
      return this.delayReturn().then(() => Promise.reject());
    }
  };

  readPersonalShift = (yearMonth: string ,uuid: string): Promise<PersonalShift> => {
    console.log('mock api readPersonalShift', {yearMonth, uuid});
    const index = this.personalShifts.findIndex(personalShift => personalShift.uuid === uuid);
    if (index > -1) {
      return this.delayReturn().then(() => Object.assign({}, this.personalShifts[index]));
    } else {
      return this.delayReturn().then(() => Promise.reject());
    }
  };

  readStatistic = (yearMonth: string, uuid: string): Promise<Statistic> => {
    const statisticsInYearMonth = this.statistics.filter(_statistic => _statistic.date.includes(yearMonth));
    const index = statisticsInYearMonth.findIndex(_statistic => _statistic.uuid === uuid);
    if (index > -1) {
      return this.delayReturn().then(() => Object.assign({}, statisticsInYearMonth[index]));
    } else {
      return this.delayReturn().then(() => Promise.reject());
    }
  };

  createStatistic = (statistic: Statistic): Promise<void> => {
    this.statistics.push(statistic);
    return this.delayReturn();
  };

  updateStatistic = (statistic: Statistic): Promise<void> => {
    const index = this.statistics.findIndex(_statistic => _statistic.uuid === statistic.uuid);
    if (index > -1) {
      this.statistics.splice(index, 1);
      this.statistics.push(statistic);
      return this.delayReturn();
    } else {
      return this.delayReturn().then(() => Promise.reject());
    }
  };

  private delayReturn = (): Promise<void> => {
    return firstValueFrom(timer(1000).pipe(map(() => {})));
  }
}
