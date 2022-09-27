import { User, UserKey } from 'src/app/_interfaces/user.interface';
import { Congregation } from 'src/app/_interfaces/congregation.interface';
import { Site } from 'src/app/_interfaces/site.interface';
import { ShiftHours } from '../_interfaces/shift-hours.interface';
import { Shift } from '../_interfaces/shift.interface';
import { PersonalShifts } from '../_interfaces/personal-shifts.interface';
import { Statistic } from '../_interfaces/statistic.interface';
import { SiteShifts } from '../_interfaces/site-shifts.interface';

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
  ) => Promise<{ date: string; hour: ShiftHours; site: Site }[]>;

  readCongregations: () => Promise<Congregation[]>;

  readSites: () => Promise<Site[]>;

  readShiftHoursList: () => Promise<ShiftHours[]>;

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
}
