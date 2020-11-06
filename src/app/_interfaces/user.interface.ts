import { Gender } from 'src/app/_enum/gender.emun';

export interface User {
  guid: string;
  username: string;
  name: string;
  gender: Gender;
  congregation: string;
  permissionProfile: string;
  cellphone?: string;
  phone?: string;
  address?: string;
  note?: string;
  tags?: string[];
}

export interface UserGuidMapItem {
  guid: string;
  username: string;
}
