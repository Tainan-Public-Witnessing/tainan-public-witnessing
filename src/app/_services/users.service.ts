import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, UserPrimarykey } from 'src/app/_interfaces/user.interface';
import { Api } from 'src/app/_api/mock.api';
import { Status } from '../_enums/status.enum';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private userPrimarykeys$ = new BehaviorSubject<UserPrimarykey[]>(null);
  private users = new Map<string, BehaviorSubject<User>>();
  private usersMaxSize = 20;

  constructor(
    private api: Api
  ) { }

  getUserPrimarykeys = (): BehaviorSubject<UserPrimarykey[]> => {
    if (!this.userPrimarykeys$.getValue()) {
      this.api.readUserPrimarykeys().subscribe(this.userPrimarykeys$);
    }
    return this.userPrimarykeys$;
  }

  getUserByUuid = (uuid: string): BehaviorSubject<User> => {
    if (this.users.has(uuid)) {
      return this.users.get(uuid);
    } else {
      const user$ = new BehaviorSubject<User>(null);
      this.api.readUser(uuid).subscribe(user$);
      this.users.set(uuid, user$);
      this.checkUsersSize();
      return user$;
    }
  }

  createUser = (user: User): Promise<Status> => {
    const userPrimarykeys = this.userPrimarykeys$.getValue();
    if (userPrimarykeys) {
      if (!userPrimarykeys.find(object => object.username === user.username)) {
        return this.api.createUserPrimarykey({
          uuid: null,
          username: user.username
        }).then(uuid => {
          user.uuid = uuid;
          return this.api.createUser(user);
        });
      } else {
        return Promise.reject(Status.EXISTED);
      }
    } else {
      return Promise.reject(Status.NOT_LOADED);
    }
  }

  updateUser = (user: User): Promise<Status> => {
    const userPrimarykeys = this.userPrimarykeys$.getValue();
    if (userPrimarykeys) {
      if (!userPrimarykeys.find(object => object.username === user.username && object.uuid !== user.uuid)) {
        return this.api.updateUserPrimarykey({
          uuid: user.uuid,
          username: user.username
        }).then(() => {
          return this.api.updateUser(user);
        });
      } else {
        return Promise.reject(Status.EXISTED);
      }
    } else {
      return Promise.reject(Status.NOT_LOADED);
    }
  }

  deleteUser = (uuid: string): Promise<Status> => {
    return this.api.deleteUserPrimarykey(uuid).then(() => {
      return this.api.deleteUser(uuid);
    });
  }

  private checkUsersSize = (): void => {
    if ( this.users.size > this.usersMaxSize) {
      this.users.delete(this.users.keys().next().value);
    }
  }
}
