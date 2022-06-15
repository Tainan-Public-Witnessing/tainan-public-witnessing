import { Injectable } from '@angular/core';
import { ApiInterface } from 'src/app/_api/api.interface';
import { User, UserKey } from '../_interfaces/user.interface';
import { Congregation } from '../_interfaces/congregation.interface';
import { Site } from '../_interfaces/site.interface';
import { ShiftHours } from '../_interfaces/shift-hours.interface';
import { Shift } from '../_interfaces/shift.interface';
import { Gender } from '../_enums/gender.enum';
import { Permission } from '../_enums/permission.enum';
import { PersonalShift } from '../_interfaces/personal-shift.interface';
import { Statistic } from '../_interfaces/statistic.interface';
import { firstValueFrom, timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Api implements ApiInterface {

  private accounts: {uuid: string, password: string}[] = [
    {
      uuid: '73783509-ecf4-4522-924b-c782d41fb95c',
      password: 'DEV'
    }, {
      uuid: '620a6781-1ef4-4ac6-b23f-8efe20348907',
      password: 'ADMIN'
    }, {
      uuid: '9efe91be-3b71-40e7-8ea2-6e2768bb2ebd',
      password: 'MANAGER'
    }, {
      uuid: 'bdb0fd54-b203-4e87-b744-1867d7eb0932',
      password: 'USER'
    },
  ];

  private userKeys: UserKey[] = [
    {
      uuid: '73783509-ecf4-4522-924b-c782d41fb95c',
      username: 'Phillip Tsai',
      activate: true,
    }, {
      uuid: '620a6781-1ef4-4ac6-b23f-8efe20348907',
      username: 'Amanda Tsai',
      activate: true,
    }, {
      uuid: '9efe91be-3b71-40e7-8ea2-6e2768bb2ebd',
      username: 'Peter Tsai',
      activate: true,
    }, {
      uuid: 'bdb0fd54-b203-4e87-b744-1867d7eb0932',
      username: 'Rachel Tsai',
      activate: true,
    },
  ];

  private users: User[] = [
    Object.assign({
      name: 'Phillip Tsai',
      gender: Gender.MALE,
      congregationUuid: '7e4fc670-12d9-483c-8fdc-2c0f1b6e889a',
      permission: Permission.DEVELOPER,
      baptizeDate: '2000-01-01',
      birthDate: '2000-01-01',
      cellphone: '',
      email: '',
      phone: '',
      address: '',
      note: '',
      tagUuids: ['']
    }, this.userKeys[0]),
    Object.assign({
      name: 'Amanda Tsai',
      gender: Gender.FEMALE,
      congregationUuid: '7e4fc670-12d9-483c-8fdc-2c0f1b6e889a',
      permission: Permission.ADMINISTRATOR,
      baptizeDate: '2000-01-01',
      birthDate: '2000-01-01',
      cellphone: '',
      email: '',
      phone: '',
      address: '',
      note: '',
      tagUuids: ['']
    }, this.userKeys[1]),
    Object.assign({
      name: 'Peter Tsai',
      gender: Gender.MALE,
      congregationUuid: '52a092bb-48b9-4a87-b269-c8774f844671',
      permission: Permission.MANAGER,
      baptizeDate: '2000-01-01',
      birthDate: '2000-01-01',
      cellphone: '',
      email: '',
      phone: '',
      address: '',
      note: '',
      tagUuids: ['']
    }, this.userKeys[2]),
    Object.assign({
      name: 'Rachel Tsai',
      gender: Gender.FEMALE,
      congregationUuid: '52a092bb-48b9-4a87-b269-c8774f844671',
      permission: Permission.USER,
      baptizeDate: '2000-01-01',
      birthDate: '2000-01-01',
      cellphone: '',
      email: '',
      phone: '',
      address: '',
      note: '',
      tagUuids: ['']
    }, this.userKeys[3]),
  ];

  private congregations: Congregation[] = [
    {
      uuid: '7e4fc670-12d9-483c-8fdc-2c0f1b6e889a',
      name: 'Tainan East',
      order: 0,
      activate: true,
    }, {
      uuid: '52a092bb-48b9-4a87-b269-c8774f844671',
      name: 'Tainan West',
      order: 1,
      activate: true,
    },
  ];

  private sites: Site[] = [
    {
      uuid: '408941a1-3af4-4148-a822-baddd9fae407',
      name: 'Park',
      order: 0,
      activate: true,
    }, {
      uuid: '2ab1d2b4-e03b-47ba-991d-7ca801c79b0d',
      name: 'Station',
      order: 1,
      activate: true,
    },
  ];

  private shiftHoursList: ShiftHours[] = [
    {
      uuid: '39cd7d33-ba5c-4967-8502-a1a57f557842',
      name: 'Morning',
      startTime: '09:00',
      endTime: '12:00',
      activate: true,
    }, {
      uuid: 'bb406de4-d090-413b-a68b-ad790a332699',
      name: 'Afternoon',
      startTime: '12:00',
      endTime: '15:00',
      activate: true,
    },
  ];

  private shifts: Shift[] = [
    {
      uuid: '056f687d-2b0b-48ee-ba30-a4190a95cacb',
      date: '2022-06-13',
      shiftHoursUuid: '39cd7d33-ba5c-4967-8502-a1a57f557842',
      siteUuid: '408941a1-3af4-4148-a822-baddd9fae407',
      crewUuids: [
        '73783509-ecf4-4522-924b-c782d41fb95c',
        '620a6781-1ef4-4ac6-b23f-8efe20348907',
      ],
      activate: true,
      hasStatistic: true,
    }, {
      uuid: 'c1c9b287-1f8b-4364-810d-6218c535fb77',
      date: '2022-06-12',
      shiftHoursUuid: 'bb406de4-d090-413b-a68b-ad790a332699',
      siteUuid: '2ab1d2b4-e03b-47ba-991d-7ca801c79b0d',
      crewUuids: [
        '73783509-ecf4-4522-924b-c782d41fb95c',
        '9efe91be-3b71-40e7-8ea2-6e2768bb2ebd',
        'bdb0fd54-b203-4e87-b744-1867d7eb0932',
      ],
      activate: true,
    },
  ];

  private personalShifts: PersonalShift[] = [
    {
      uuid: '73783509-ecf4-4522-924b-c782d41fb95c',
      shiftUuids: [
        '056f687d-2b0b-48ee-ba30-a4190a95cacb',
        'c1c9b287-1f8b-4364-810d-6218c535fb77',
      ],
    }, {
      uuid: '620a6781-1ef4-4ac6-b23f-8efe20348907',
      shiftUuids: [
        '056f687d-2b0b-48ee-ba30-a4190a95cacb',
      ],
    }, {
      uuid: '9efe91be-3b71-40e7-8ea2-6e2768bb2ebd',
      shiftUuids: [
        'c1c9b287-1f8b-4364-810d-6218c535fb77',
      ],
    }, {
      uuid: 'bdb0fd54-b203-4e87-b744-1867d7eb0932',
      shiftUuids: [
        'c1c9b287-1f8b-4364-810d-6218c535fb77',
      ],
    },
  ];

  private statistics: Statistic[] = [
    {
      uuid: '056f687d-2b0b-48ee-ba30-a4190a95cacb',
      createdByUuid: '73783509-ecf4-4522-924b-c782d41fb95c',
      createdOn: new Date('2019-04-27 19:00'),
      date: '2022-06-13',
      attendance: 2,
      tracts: 3,
      scriptures: 4,
      videos: 5,
      acceptReturnVisit: 6,
      returnVisits: 7,
      experience: 'Good',
      activate: true,
    }
  ];

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
