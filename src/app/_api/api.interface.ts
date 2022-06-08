import { User, UserKey } from 'src/app/_interfaces/user.interface';
import { Congregation } from 'src/app/_interfaces/congregation.interface';
import { Site } from 'src/app/_interfaces/site.interface';
import { ShiftHours } from '../_interfaces/shift-hours.interface';
import { Shift, ShiftKey } from '../_interfaces/shift.interface';
import { PersonalShift } from '../_interfaces/personal-shift.interface';

export interface ApiInterface {

  login: (uuid: string, password: string) => Promise<void>;
  logout: (uuid: string) => Promise<void>;

  readUserKeys: () => Promise<UserKey[]>;

  readUser: (uuid: string) => Promise<User>;

  readCongregations: () => Promise<Congregation[]>;

  readSites: () => Promise<Site[]>;

  readShiftHours: () => Promise<ShiftHours[]>;

  readShiftKeys: (yearMonth: string) => Promise<ShiftKey[]>; // yyyy-MM

  readShift: (uuid: string) => Promise<Shift>;

  readPersonalShift: (uuid: string) => Promise<PersonalShift>;
}
