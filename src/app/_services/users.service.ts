import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, UserKey } from 'src/app/_interfaces/user.interface';
import { Api } from 'src/app/_api/mock.api';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private userKeys$ = new BehaviorSubject<UserKey[]|null>(null);
  private users = new Map<string, BehaviorSubject<User|null|undefined>>();

  constructor(
    private api: Api
  ) { }

  getUserKeys = (): BehaviorSubject<UserKey[]|null> => {
    if (this.userKeys$.value === null) {
      this.api.readUserKeys().then(userKeys => {
        this.userKeys$.next(userKeys);
      });
    }
    return this.userKeys$;
  }

  getUserByUuid = (uuid: string): BehaviorSubject<User|null|undefined> => {
    if (!this.users.has(uuid)) {
      const user$ = new BehaviorSubject<User|null|undefined>(null);
      this.users.set(uuid, user$);
      this.api.readUser(uuid).then(user => {
        user$.next(user);
      }).catch(reason => {
        if (reason === 'NOT_EXIST') {
          user$.next(undefined);
        }
      });
    }
    return this.users.get(uuid);
  }
}
