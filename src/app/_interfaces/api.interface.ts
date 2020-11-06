import { Observable } from 'rxjs';
import { UserGuidMapItem } from 'src/app/_interfaces/user.interface';

export interface Api {
  readUserGuidMap: () => Observable<UserGuidMapItem[]>;
  createUserGuidMapItem: (userGuidMapItem: UserGuidMapItem) => void;
  updateUserGuidMapItem: (userGuidMapItem: UserGuidMapItem) => void;
  deleteUserGuidMapItem: (guid: string) => void;
}
