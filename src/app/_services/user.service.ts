import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, UserGuidMapItem } from 'src/app/_interfaces/user.interface';
import { MockApi } from 'src/app/_api/mock.api';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userGuidMap$: BehaviorSubject<UserGuidMapItem[]> = new BehaviorSubject<UserGuidMapItem[]>(null);
  user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(null);

  constructor(
    private mockApi: MockApi
  ) { }

  loadUserGuidMap = () => {
    if (!this.userGuidMap$.getValue()) {
      this.mockApi.readUserGuidMap().subscribe(this.userGuidMap$);
    }
  }

  createUserGuidMapItem = (userGuidMapItem: UserGuidMapItem) => {
    this.mockApi.createUserGuidMapItem(userGuidMapItem);
  }

  updateUserGuidMapItem = (userGuidMapItem: UserGuidMapItem) => {
    this.mockApi.updateUserGuidMapItem(userGuidMapItem);
  }

  deleteUserGuidMapItem = (guid: string) => {
    this.mockApi.deleteUserGuidMapItem(guid);
  }

}
