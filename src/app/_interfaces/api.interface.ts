import { Observable } from 'rxjs';
import { UserUuidMapItem } from 'src/app/_interfaces/user.interface';

export interface Api {
  readUserUuidMap: () => Observable<UserUuidMapItem[]>;
  createUserUuidMapItem: (userUuidMapItem: UserUuidMapItem) => void;
  updateUserUuidMapItem: (userUuidMapItem: UserUuidMapItem) => void;
  deleteUserUuidMapItem: (uuid: string) => void;
}
