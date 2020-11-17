import { Gender } from 'src/app/_enums/gender.enum';

export interface User {
  uuid: string;
  username: string;
  name: string;
  gender: Gender;
  congregation: string; // uuid
  profile: string; // uuid
  cellphone?: string;
  phone?: string;
  address?: string;
  note?: string;
  tags?: string[]; // uuid
}

export interface UserPrimarykey {
  uuid: string;
  username: string;
}
