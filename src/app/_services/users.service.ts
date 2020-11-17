import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, UserPrimarykey } from 'src/app/_interfaces/user.interface';
import { MockApi } from 'src/app/_api/mock.api';
import { Status } from '../_enums/status.enum';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private userPrimarykeys$ = new BehaviorSubject<UserPrimarykey[]>(null);
  private users = new Map<string, BehaviorSubject<User>>();

  constructor(
    private mockApi: MockApi
  ) { }

  getUserPrimarykeys = (): BehaviorSubject<UserPrimarykey[]> => {
    if (!this.userPrimarykeys$.getValue()) {
      this.mockApi.readUserPrimarykeys().subscribe(this.userPrimarykeys$);
    }
    return this.userPrimarykeys$;
  }

  createUserPrimarykey = (userPrimarykey: UserPrimarykey): Promise<Status> => {
    const userPrimarykeys = this.userPrimarykeys$.getValue();
    if (userPrimarykeys) {
      if (!userPrimarykeys.find(object => object.username === userPrimarykey.username)) {
        return this.mockApi.createUserPrimarykey(userPrimarykey).then(() => Promise.resolve(Status.SUCCESS));
      } else {
        return Promise.reject(Status.EXISTED);
      }
    } else {
      return Promise.reject(Status.NOT_LOADED);
    }
  }

  updateUserPrimarykey = (userPrimarykey: UserPrimarykey): Promise<Status> => {
    const userPrimarykeys = this.userPrimarykeys$.getValue();
    if (userPrimarykeys) {
      if (!userPrimarykeys.find(object => object.username === userPrimarykey.username)) {
        return this.mockApi.updateUserPrimarykey(userPrimarykey);
      } else {
        return Promise.reject(Status.EXISTED);
      }
    } else {
      return Promise.reject(Status.NOT_LOADED);
    }
  }

  deleteUserPrimarykey = (uuid: string): Promise<Status> => {
    return this.mockApi.deleteUserPrimarykey(uuid);
  }
}
