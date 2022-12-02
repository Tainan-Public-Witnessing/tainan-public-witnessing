import { UserKey } from './user.interface';

export interface Settings {
  name: string;
  userKeys: UserKey[];
}
