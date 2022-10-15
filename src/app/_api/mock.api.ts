import { Injectable } from '@angular/core';
import { firstValueFrom, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiInterface } from 'src/app/_api/api.interface';
import { v4 as uuidv4 } from 'uuid';
import { EXISTED_ERROR } from '../_classes/errors/EXISTED_ERROR';
import { Congregation } from '../_interfaces/congregation.interface';
import { PersonalShifts } from '../_interfaces/personal-shifts.interface';
import { ShiftHours } from '../_interfaces/shift-hours.interface';
import { Shift } from '../_interfaces/shift.interface';
import { Site } from '../_interfaces/site.interface';
import { Statistic } from '../_interfaces/statistic.interface';
import { UserSchedule } from '../_interfaces/user-schedule.interface';
import { User, UserKey } from '../_interfaces/user.interface';
import {
  ACCOUNTS,
  CONGREGATIONS,
  PERSONAL_SHIFTS_LIST,
  SHIFTS,
  SHIFT_HOURS_LIST,
  SITES,
  SITE_SHIFTS,
  STATISTICS,
  USERS,
  USER_KEYS,
  USER_SCHEDULE_CONFIGS,
} from './mock-data';

@Injectable({
  providedIn: 'root',
})
export class Api implements ApiInterface {
  private accounts: { uuid: string; password: string }[] = ACCOUNTS;
  private userKeys: UserKey[] = USER_KEYS;
  private users: User[] = USERS;
  private congregations: Congregation[] = CONGREGATIONS;
  private sites: Site[] = SITES;
  private shiftHoursList: ShiftHours[] = SHIFT_HOURS_LIST;
  private shifts: Shift[] = SHIFTS;
  private personalShiftsList: PersonalShifts[] = PERSONAL_SHIFTS_LIST;
  private statistics: Statistic[] = STATISTICS;

  login = (uuid: string, password: string): Promise<void> => {
    console.log('mock api login', { uuid, password });
    const index = this.accounts.findIndex((account) => account.uuid === uuid);
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
    console.log('mock api readUser', { uuid });
    const index = this.users.findIndex((user) => user.uuid === uuid);
    if (index > -1) {
      return this.delayReturn().then(() =>
        Object.assign({}, this.users[index])
      );
    } else {
      return this.delayReturn().then(() => Promise.reject());
    }
  };

  createUser = (user: Omit<User, 'uuid' | 'activate'>) => {
    console.log('mock api createUser', { user });

    const existed = USERS.find((u) => u.username === user.username);
    if (existed) throw new EXISTED_ERROR('username');

    const uuid = uuidv4();
    USERS.push({ ...user, activate: true, uuid });
    USER_KEYS.push({ uuid, activate: true, username: user.username });
    USER_SCHEDULE_CONFIGS[uuid] = {
      availableHours: {},
      unavailableDates: [],
      partnerUuid: '',
      assign: true,
    };
    return this.delayReturn().then(() => uuid);
  };

  patchUser = (user: Omit<User, 'activate'>) => {
    console.log('mock api patchUser', { user });
    const uIndex = USERS.findIndex((u) => u.uuid === user.uuid);
    USERS[uIndex] = {
      ...USERS[uIndex],
      ...user,
    };

    const ukIndex = USER_KEYS.findIndex((uk) => uk.uuid === user.uuid);
    USER_KEYS[ukIndex].username = user.username;

    return this.delayReturn();
  };

  updateUserActivation = (uuid: string, activate: boolean) => {
    console.log('mock api updateUserActivation', { uuid, activate });
    if (!activate) {
      const userShifts = PERSONAL_SHIFTS_LIST.find(
        (userShift) => userShift.uuid === uuid
      );
      if (userShifts && Array.isArray(userShifts.shiftUuids)) {
        const futureShifts = userShifts.shiftUuids
          .map((shiftUuid) => SHIFTS.find((shift) => shift.uuid === shiftUuid)!)
          .map((shift) => ({
            date: shift.date,
            hour: SHIFT_HOURS_LIST.find(
              (hour) => hour.uuid === shift.shiftHoursUuid
            )!,
            site: SITES.find((site) => site.uuid === shift.siteUuid)!,
          }))
          .filter(
            (shift) =>
              new Date(`${shift.date}T${shift.hour.startTime}:00.000`) >
              new Date()
          );
        if (futureShifts.length > 0) {
          return this.delayReturn().then(() => futureShifts);
        }
      }
    }

    const user = USERS.find((u) => u.uuid === uuid)!;
    user.activate = activate;
    this.users = [...USERS];

    const userKey = USER_KEYS.find((uk) => uk.uuid === uuid)!;
    userKey.activate = activate;
    this.userKeys = [...USER_KEYS];

    if (USER_SCHEDULE_CONFIGS[uuid]) {
      USER_SCHEDULE_CONFIGS[uuid].assign = activate;
    }

    return this.delayReturn().then(() => []);
  };

  readCongregations = (): Promise<Congregation[]> => {
    console.log('mock api readCongregations');
    return this.delayReturn().then(() => [...this.congregations]);
  };
  createCongregation = async (
    cong: Omit<Congregation, 'uuid' | 'activate'>
  ): Promise<Congregation> => {
    let uuid: string = uuidv4();
    console.log('mock api createCongregations');
    return this.delayReturn().then(() => ({ uuid, ...cong, activate: true }));
  };

  changeCongregationActivation = async (
    cong: Congregation
  ): Promise<boolean> => {
    console.log('mock api Cong status changed', cong.name);
    return this.delayReturn().then(() => !cong.activate);
  };

  readSites = (): Promise<Site[]> => {
    console.log('mock api readSites');
    return this.delayReturn().then(() => [...this.sites]);
  };

  createSites = async (
    site: Omit<Site, 'uuid' >
  ): Promise<string> => {
    let uuid: string = uuidv4();
    console.log('mock api createSites');
    return this.delayReturn().then(() => uuid);
  };

  updateSites = async (site:Site): Promise<void> => {
    console.log('mock api patchSites');
    return this.delayReturn();
  };

  changeSiteActivation = async (site: Site): Promise<boolean> => {
    console.log('mock api Sites status changed', site.name);
    return this.delayReturn().then(() => !site.activate);
  };

  readShiftHoursList = (): Promise<ShiftHours[]> => {
    console.log('mock api readShiftHoursList');
    return this.delayReturn().then(() => [...this.shiftHoursList]);
  };

  createShiftHours = async (
    shifthours: Omit<ShiftHours, 'uuid' | 'activate'>
  ): Promise<ShiftHours> => {
    let uuid: string = uuidv4();
    console.log('mock api createShiftHours');
    return this.delayReturn().then(() => ({
      uuid,
      ...shifthours,
      activate: true,
    }));
  };

  changeShiftHourActivation = async (
    shifthour: ShiftHours
  ): Promise<boolean> => {
    console.log('mock api ShiftHour status changed', shifthour.name);
    return this.delayReturn().then(() => !shifthour.activate);
  };

  changeShiftHourDelivery = async (shifthour: ShiftHours): Promise<boolean> => {
    console.log('mock api Sites delivery status changed', shifthour.name);
    return this.delayReturn().then(() => !shifthour.deliver);
  };

  readShiftsByMonth = (yearMonth: string): Promise<Shift[]> => {
    console.log('mock api readShiftsByMonth', { yearMonth });
    const _shifts = this.shifts.filter((_shift) =>
      _shift.date.includes(yearMonth)
    );
    if (_shifts.length > 0) {
      return this.delayReturn().then(() => [..._shifts]);
    } else {
      return this.delayReturn().then(() => Promise.reject());
    }
  };

  readShiftsByDate = (date: string): Promise<Shift[]> => {
    console.log('mock api readShiftsByDate', { date });
    const _shifts = this.shifts.filter((_shift) => _shift.date === date);
    if (_shifts.length > 0) {
      return this.delayReturn().then(() => [..._shifts]);
    } else {
      return this.delayReturn().then(() => Promise.reject());
    }
  };

  readShifts = (yearMonth: string, uuids: string[]): Promise<Shift[]> => {
    console.log('mock api readShifts', { yearMonth, uuids });
    const shiftsInYearMonth = this.shifts.filter((_shift) =>
      _shift.date.includes(yearMonth)
    );
    const _shifts = uuids
      .map((uuid) => {
        const index = shiftsInYearMonth.findIndex(
          (_shift) => _shift.uuid === uuid
        );
        if (index > -1) {
          return shiftsInYearMonth[index];
        } else {
          return undefined;
        }
      })
      .filter((_shift) => _shift !== undefined) as Shift[];
    if (_shifts.length > 0) {
      return this.delayReturn().then(() => [..._shifts]);
    } else {
      return this.delayReturn().then(() => Promise.reject());
    }
  };

  readShift = (yearMonth: string, uuid: string): Promise<Shift> => {
    console.log('mock api readShift', { yearMonth, uuid });
    const shiftsInYearMonth = this.shifts.filter((_shift) =>
      _shift.date.includes(yearMonth)
    );
    const index = shiftsInYearMonth.findIndex((_shift) => _shift.uuid === uuid);
    if (index > -1) {
      return this.delayReturn().then(() =>
        Object.assign({}, shiftsInYearMonth[index])
      );
    } else {
      return this.delayReturn().then(() => Promise.reject());
    }
  };

  updateShift = (shift: Shift): Promise<void> => {
    console.log('mock api updateShift', { shift });
    const index = this.shifts.findIndex(
      (_shifts) => _shifts.uuid === shift.uuid
    );
    if (index > -1) {
      this.shifts.splice(index, 1);
      this.shifts.push(shift);
      return this.delayReturn();
    } else {
      return this.delayReturn().then(() => Promise.reject());
    }
  };

  readPersonalShifts = (
    yearMonth: string,
    uuid: string
  ): Promise<PersonalShifts> => {
    console.log('mock api readPersonalShift', { yearMonth, uuid });
    const index = this.personalShiftsList.findIndex(
      (personalShift) =>
        personalShift.uuid === uuid && personalShift.yearMonth === yearMonth
    );
    if (index > -1) {
      return this.delayReturn().then(() =>
        Object.assign({}, this.personalShiftsList[index])
      );
    } else {
      return this.delayReturn().then(() => Promise.reject());
    }
  };

  createPersonalShifts = (
    yearMonth: string,
    personalShift: PersonalShifts
  ): Promise<void> => {
    console.log('mock api createPersonalShifts', { yearMonth, personalShift });
    personalShift.yearMonth = yearMonth;
    this.personalShiftsList.push(personalShift);
    return this.delayReturn();
  };

  updatePersonalShifts = (
    yearMonth: string,
    personalShift: PersonalShifts
  ): Promise<void> => {
    console.log('mock api updatePersonalShift', { yearMonth, personalShift });
    const index = this.personalShiftsList.findIndex(
      (_personalShift) => _personalShift.uuid === personalShift.uuid
    );
    if (index > -1) {
      this.personalShiftsList.splice(index, 1);
      this.personalShiftsList.push(personalShift);
      return this.delayReturn();
    } else {
      return this.delayReturn().then(() => Promise.reject());
    }
  };

  readStatistic = (yearMonth: string, uuid: string): Promise<Statistic> => {
    console.log('mock api readStatistic', { yearMonth, uuid });
    const statisticsInYearMonth = this.statistics.filter((_statistic) =>
      _statistic.date.includes(yearMonth)
    );
    const index = statisticsInYearMonth.findIndex(
      (_statistic) => _statistic.uuid === uuid
    );
    if (index > -1) {
      return this.delayReturn().then(() =>
        Object.assign({}, statisticsInYearMonth[index])
      );
    } else {
      return this.delayReturn().then(() => Promise.reject());
    }
  };

  createStatistic = (statistic: Statistic): Promise<void> => {
    console.log('mock api createStatistic', { statistic });
    this.statistics.push(statistic);
    return this.delayReturn();
  };

  updateStatistic = (statistic: Statistic): Promise<void> => {
    console.log('mock api updateStatistic', { statistic });
    const index = this.statistics.findIndex(
      (_statistic) => _statistic.uuid === statistic.uuid
    );
    if (index > -1) {
      this.statistics.splice(index, 1);
      this.statistics.push(statistic);
      return this.delayReturn();
    } else {
      return this.delayReturn().then(() => Promise.reject());
    }
  };

  readSiteShifts = () => {
    console.log('mock api readSiteShifts');
    return this.delayReturn().then(() => SITE_SHIFTS);
  };

  readUserSchedule = async (userUuid: string) => {
    console.log('mock api readUserSchedule', { userUuid });
    await this.delayReturn();
    return USER_SCHEDULE_CONFIGS[userUuid];
  };

  patchUserSchedule = async (userUuid: string, data: Partial<UserSchedule>) => {
    console.log('mock api patchUserSchedule', { userUuid, data });
    USER_SCHEDULE_CONFIGS[userUuid] = {
      ...USER_SCHEDULE_CONFIGS[userUuid],
      ...data,
    };
    await this.delayReturn();
  };

  private delayReturn = (): Promise<void> => {
    return firstValueFrom(timer(500).pipe(map(() => {})));
  };
}
