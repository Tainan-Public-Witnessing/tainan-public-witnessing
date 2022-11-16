import { Gender } from 'src/app/_enums/gender.enum';
import { Permission } from '../_enums/permission.enum';
export interface UserKey {
  uuid: string;
  username: string;
  activate: boolean;
}
export interface User extends UserKey {
  uuid: string;
  name: string;
  gender: Gender;
  congregationUuid: string; // uuid
  permission: Permission;
  baptizeDate: string; // yyyy-MM-DD
  bind_code?: string;
  // birthDate: string; // yyyy-MM-DD
  cellphone: string;
  // email: string;
  phone: string;
  // address: string;
  note: string;
  // tagUuids: string[]; // uuid
}
