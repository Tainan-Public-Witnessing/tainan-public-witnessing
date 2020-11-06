import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, UserUuidMapItem } from 'src/app/_interfaces/user.interface';
import { MockApi } from 'src/app/_api/mock.api';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userUuidMap$: BehaviorSubject<UserUuidMapItem[]> = new BehaviorSubject<UserUuidMapItem[]>(null);
  user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(null);

  constructor(
    private mockApi: MockApi
  ) { }

  loadUserUuidMap = () => {
    if (!this.userUuidMap$.getValue()) {
      this.mockApi.readUserUuidMap().subscribe(this.userUuidMap$);
    }
  }

  createUserUuidMapItem = (userUuidMapItem: UserUuidMapItem) => {
    this.mockApi.createUserUuidMapItem(userUuidMapItem);
  }

  updateUserUuidMapItem = (userUuidMapItem: UserUuidMapItem) => {
    this.mockApi.updateUserUuidMapItem(userUuidMapItem);
  }

  deleteUserUuidMapItem = (uuid: string) => {
    this.mockApi.deleteUserUuidMapItem(uuid);
  }

}
