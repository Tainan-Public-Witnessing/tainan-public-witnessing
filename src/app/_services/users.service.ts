import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User, UserPrimarykey } from 'src/app/_interfaces/user.interface';
import { Api } from 'src/app/_api/mock.api';
import { Status } from 'src/app/_enums/status.enum';
import * as ADMINISTRATOR from 'src/assets/default-users/user-administrator.json';
import { GetDataOptions } from 'src/app/_interfaces/options.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  // tslint:disable-next-line: no-string-literal
  private readonly administrator = ADMINISTRATOR['default'] as User;

  private userPrimarykeys$ = new BehaviorSubject<UserPrimarykey[]>(null);
  private defaultUserPrimarykeys$ = new BehaviorSubject<UserPrimarykey[]>([this.administrator]);

  private users = new Map<string, BehaviorSubject<User>>();
  private defaultUsers = new Map<string, BehaviorSubject<User>>([
    [this.administrator.uuid, new BehaviorSubject(this.administrator)]
  ]);

  private readonly usersMaxSize = 20;

  constructor(
    private api: Api
  ) { }

  getUserPrimarykeys = (): BehaviorSubject<UserPrimarykey[]> => {
    if (!this.userPrimarykeys$.getValue()) {
      this.api.readUserPrimarykeys().pipe(
        map(userPrimarykeys => this.defaultUserPrimarykeys$.getValue().concat(userPrimarykeys))
      ).subscribe(this.userPrimarykeys$);
    }
    return this.userPrimarykeys$;
  }

  /**
   * @description If options.immortal set to true, the returned observable will not be unsubscribe when checking users size.
   */
  getUserByUuid = (uuid: string, options?: GetDataOptions): BehaviorSubject<User> => {
    if (this.defaultUsers.has(uuid)) {
      return this.defaultUsers.get(uuid);
    } else if (this.users.has(uuid)) {
      return this.users.get(uuid);
    } else {
      const user$ = new BehaviorSubject<User>(null);
      if (!options?.immortal) {
        this.api.readUser(uuid).subscribe(user$);
        this.users.set(uuid, user$);
        this.checkUsersSize();
      }
      return user$;
    }
  }

  createUser = (user: User): Promise<Status> => {
    const userPrimarykeys = this.userPrimarykeys$.getValue();
    const defaultUserPrimarykeys = this.defaultUserPrimarykeys$.getValue();
    if (userPrimarykeys) {
      if ( // not exist
        !userPrimarykeys.find(object => object.username === user.username) &&
        !defaultUserPrimarykeys.find(object => object.username === user.username)
      ) {
        return this.api.createUserPrimarykey({
          uuid: null,
          username: user.username
        }).then(uuid => {
          user.uuid = uuid;
          return this.api.createUser(user);
        });
      } else { // existed
        return Promise.reject(Status.EXISTED);
      }
    } else {
      return Promise.reject(Status.NOT_LOADED);
    }
  }

  updateUser = (user: User): Promise<Status> => {
    const userPrimarykeys = this.userPrimarykeys$.getValue();
    const defaultUserPrimarykeys = this.defaultUserPrimarykeys$.getValue();
    if (userPrimarykeys) {
      if (
        !userPrimarykeys.find(object => object.username === user.username && object.uuid !== user.uuid) &&
        !defaultUserPrimarykeys.find(object => object.username === user.username && object.uuid !== user.uuid)
      ) {
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

  isDefaultUser = (uuid: string): boolean => {
    return !!this.defaultUserPrimarykeys$.getValue().find(userPrimarykey => userPrimarykey.uuid === uuid);
  }

  private checkUsersSize = (): void => {
    if ( this.users.size > this.usersMaxSize) {
      const uuid = this.users.keys().next().value;
      this.users.get(uuid).unsubscribe();
      this.users.delete(uuid);
      this.api.unsubscribeStream(uuid);
    }
  }
}
