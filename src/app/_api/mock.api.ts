import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v5 as uuidv5 } from 'uuid';
import { environment } from 'src/environments/environment';
import { Api } from 'src/app/_interfaces/api.interface';
import { UserUuidMapItem } from 'src/app/_interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class MockApi implements Api {

  /** user uuid map */

  private userUuidMap$ = new BehaviorSubject<UserUuidMapItem[]>([
    { uuid: 'e90966a2-91a8-5480-bc02-67f88277e5f8', username: 'John'}
  ]);

  readUserUuidMap = () => {
    return this.userUuidMap$;
  }

  createUserUuidMapItem = (userUuidMapItem: UserUuidMapItem) => {
    const userUuidMap = this.userUuidMap$.getValue();
    userUuidMapItem.uuid = uuidv5(userUuidMapItem.username, environment.UUID_NAMESPACE);
    userUuidMap.push(userUuidMapItem);
    this.userUuidMap$.next(userUuidMap);
  }

  updateUserUuidMapItem = (userUuidMapItem: UserUuidMapItem) => {
    const userUuidMap = this.userUuidMap$.getValue();
    const existObject = userUuidMap.find(item => item.uuid === userUuidMapItem.uuid);
    if (existObject) {
      for (const index of Object.keys(existObject)) {
        existObject[index] = userUuidMapItem[index];
      }
      this.userUuidMap$.next(userUuidMap);
    }
  }

  deleteUserUuidMapItem = (uuid: string) => {
    const userUuidMap = this.userUuidMap$.getValue();
    const existIndex = userUuidMap.findIndex(item => item.uuid === uuid);
    if (existIndex !== -1) {
      userUuidMap.splice(existIndex, 1);
      this.userUuidMap$.next(userUuidMap);
    }
  }
}
