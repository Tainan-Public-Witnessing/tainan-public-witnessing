import { Gender } from 'src/app/_enum/gender.emun';
import { Congregation } from 'src/app/_interfaces/congregation.interface';

export interface User {
  uuid: string;
  username: string;
  name: string;
  gender: Gender;
  congregation: Congregation;
  permissionProfile: string;
  cellphone?: string;
  phone?: string;
  address?: string;
  note?: string;
  tags?: string[];
}

export interface UserUuidMapItem {
  uuid: string;
  username: string;
}
