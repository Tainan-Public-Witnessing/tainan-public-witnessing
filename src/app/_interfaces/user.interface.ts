import { Gender } from 'src/app/_enums/gender.emun';
import { Congregation } from 'src/app/_interfaces/congregation.interface';
import { Tag } from 'src/app/_interfaces/tag.interface';

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
  tags?: Tag[];
}

export interface UserUuidMapItem {
  uuid: string;
  username: string;
}
