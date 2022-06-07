import { Gender } from 'src/app/_enums/gender.enum';
export interface UserKey {
  uuid: string;
  username: string;
  activate: boolean;
}
export interface User extends UserKey {
  name: string;
  gender: Gender;
  congregation: string; // uuid
  profile: string; // uuid
  baptizeDate: string; // yyyy-MM-DD
  birthDate: string; // yyyy-MM-DD
  cellphone: string;
  phone: string;
  address: string;
  note: string;
  tags: string[]; // uuid
}
