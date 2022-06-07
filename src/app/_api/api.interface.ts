import { User, UserKey } from 'src/app/_interfaces/user.interface';
import { CongregationKey } from 'src/app/_interfaces/congregation.interface';
import { SiteKey } from 'src/app/_interfaces/site.interface';
import { ShiftHoursKey } from '../_interfaces/shift-hours.interface';
import { Shift, ShiftKey } from '../_interfaces/shift.interface';

export interface UserAuthorityStatus {
  uuid: string;
  password: string;
  online: boolean;
}

export interface ApiInterface {

  login: (uuid: string, password: string) => Promise<void>;
  logout: (uuid: string) => Promise<void>;

  readUserKeys: () => Promise<UserKey[]>;

  readUser: (uuid: string) => Promise<User>;

  readCongregations: () => Promise<CongregationKey[]>;

  readSites: () => Promise<SiteKey[]>;

  readShiftHours: () => Promise<ShiftHoursKey[]>;

  readShiftKeys: () => Promise<ShiftKey[]>;

  readShift: (uuid: string) => Promise<Shift>;
}
