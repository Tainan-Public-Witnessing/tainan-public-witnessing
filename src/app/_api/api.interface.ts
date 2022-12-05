import { Congregation } from 'src/app/_interfaces/congregation.interface';
import { Site } from 'src/app/_interfaces/site.interface';
import { User, UserKey } from 'src/app/_interfaces/user.interface';
import { PersonalShifts } from '../_interfaces/personal-shifts.interface';
import { ShiftHour } from '../_interfaces/shift-hours.interface';
import { Shift } from '../_interfaces/shift.interface';
import { SiteShifts } from '../_interfaces/site-shifts.interface';
import { Statistic } from '../_interfaces/statistic.interface';
import { UserSchedule } from '../_interfaces/user-schedule.interface';

export interface ApiInterface {
  login: (uuid: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  readUserKeys: () => Promise<UserKey[]>;

  readUser: (uuid: string) => Promise<User>;
  /**
   * create new user and return its uuid
   * @return {string} new user uuid
   */
  createUser: (user: Omit<User, 'uuid' | 'activate'>) => Promise<string>;
  patchUser: (user: Omit<User, 'activate'>) => Promise<void>;
  updateUserActivation: (
    uuid: string,
    activate: boolean
  ) => Promise<{ date: string; hour: ShiftHour; site: Site }[]>;

  readCongregations: () => Promise<Congregation[]>;
  createCongregation: (cong: Omit<Congregation, 'uuid' | 'activate' | 'order'>) => Promise<void>
  updateCongregation: (cong: Omit<Congregation, 'activate' | 'order'>) => Promise<void>
  changeCongregationActivation: (cong: Congregation) => Promise<boolean>

  readSites: () => Promise<Site[]>;
  createSite: (site: Omit<Site, 'uuid'>) => Promise<void>;
  updateSite: (site: Site) => Promise<void>
  changeSiteActivation: (site: Site) => Promise<boolean>

  readShiftHours: () => Promise<ShiftHour[]>;
  createShiftHour: (shifthour: Omit<ShiftHour, 'uuid' | 'activate' | 'deliver'>) => Promise<void>
  updateShiftHour: (shiftHour: ShiftHour) => Promise<void>
  changeShiftHourActivation: (shifthour: ShiftHour) => Promise<boolean>
  changeShiftHourDelivery: (shifthour: ShiftHour) => Promise<boolean>

  readShiftsByMonth: (yearMonth: string) => Promise<Shift[]>; // yyyy-MM
  readShiftsByDate: (date: string) => Promise<Shift[]>; // yyyy-MM-dd
  readShifts: (
    yearMonth: string,
    uuids: string[]
  ) => Promise<(Shift | undefined)[]>;
  readShift: (yearMonth: string, uuid: string) => Promise<Shift>;
  updateShift: (shift: Shift) => Promise<void>;

  readPersonalShifts: (
    yearMonth: string,
    uuid: string
  ) => Promise<PersonalShifts>;
  createPersonalShifts: (
    yearMonth: string,
    personalShift: PersonalShifts
  ) => Promise<void>;
  updatePersonalShifts: (
    yearMonth: string,
    personalShift: PersonalShifts
  ) => Promise<void>;

  readStatistic: (yearMonth: string, uuid: string) => Promise<Statistic>;
  createStatistic: (statistic: Statistic) => Promise<void>;
  updateStatistic: (statistic: Statistic) => Promise<void>;

  readSiteShifts: () => Promise<SiteShifts[]>;

  readUserSchedule: (userUuid: string) => Promise<UserSchedule>;
  patchUserSchedule: (
    userUuid: string,
    data: Partial<UserSchedule>
  ) => Promise<void>;

  cancelLineToken: (userUuid: string) => Promise<void>;
}
