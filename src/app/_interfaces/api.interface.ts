import { Observable } from 'rxjs';
import { UserUuidMapItem } from 'src/app/_interfaces/user.interface';
import { Congregation } from './congregation.interface';

export interface Api {
  readUserUuidMap: () => Observable<UserUuidMapItem[]>;
  createUserUuidMapItem: (userUuidMapItem: UserUuidMapItem) => void;
  updateUserUuidMapItem: (userUuidMapItem: UserUuidMapItem) => void;
  deleteUserUuidMapItem: (uuid: string) => void;

  readCongregations: () => Observable<Congregation[]>;
  sortCongregations: (congregations: Congregation[]) => Promise<string>;
  createCongregation: (congregation: Congregation) => Promise<string>;
  updateCongregation: (congregation: Congregation) => Promise<string>;
  deleteCongregation: (uuid: string) => Promise<string>;
}
