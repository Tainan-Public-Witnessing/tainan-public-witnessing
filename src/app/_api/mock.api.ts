import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Api } from 'src/app/_interfaces/api.interface';
import { UserGuidMapItem } from 'src/app/_interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class MockApi implements Api {

  /** user guid map */

  private userGuidMap: UserGuidMapItem[] = [
    { guid: 'haha', username: 'John'}
  ];

  private userGuidMap$ = new BehaviorSubject<UserGuidMapItem[]>(this.userGuidMap);

  readUserGuidMap = () => {
    return this.userGuidMap$;
  }

  createUserGuidMapItem = (userGuidMapItem: UserGuidMapItem) => {
    const existObject = this.userGuidMap.find(item => item.guid === userGuidMapItem.guid);
    if (!existObject) {
      this.userGuidMap.push(userGuidMapItem);
      this.userGuidMap$.next(this.userGuidMap);
    }
  }

  updateUserGuidMapItem = (userGuidMapItem: UserGuidMapItem) => {
    const existObject = this.userGuidMap.find(item => item.guid === userGuidMapItem.guid);
    if (existObject) {
      for (const index of Object.keys(existObject)) {
        existObject[index] = userGuidMapItem[index];
      }
      this.userGuidMap$.next(this.userGuidMap);
    }
  }

  deleteUserGuidMapItem = (guid: string) => {
    const existIndex = this.userGuidMap.findIndex(item => item.guid === guid);
    if (existIndex !== -1) {
      this.userGuidMap.splice(existIndex, 1);
      this.userGuidMap$.next(this.userGuidMap);
    }
  }
}
