import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, UserPrimarykey } from 'src/app/_interfaces/user.interface';
import { MockApi } from 'src/app/_api/mock.api';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userPrimarykeys$: BehaviorSubject<UserPrimarykey[]> = new BehaviorSubject<UserPrimarykey[]>(null);
  user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(null);

  constructor(
    private mockApi: MockApi
  ) { }

  loadUserPrimarykeys = () => {
    if (!this.userPrimarykeys$.getValue()) {
      this.mockApi.readUserPrimarykeys().subscribe(this.userPrimarykeys$);
    }
  }

  createUserPrimarykey = (userPrimarykey: UserPrimarykey) => {
    this.mockApi.createUserPrimarykey(userPrimarykey);
  }

  updateUserPrimarykey = (userPrimarykey: UserPrimarykey) => {
    this.mockApi.updateUserPrimarykey(userPrimarykey);
  }

  deleteUserPrimarykey = (uuid: string) => {
    this.mockApi.deleteUserPrimarykey(uuid);
  }

}
