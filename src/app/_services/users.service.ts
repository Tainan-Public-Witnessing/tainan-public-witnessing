import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Api } from 'src/app/_api';
import { User, UserKey } from 'src/app/_interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private userKeys$: BehaviorSubject<UserKey[] | null> | undefined = undefined;
  private users = new Map<string, BehaviorSubject<User | null | undefined>>();

  constructor(private api: Api) {}

  getUserKeys = (): BehaviorSubject<UserKey[] | null> => {
    if (this.userKeys$ === undefined) {
      this.userKeys$ = new BehaviorSubject<UserKey[] | null>(null);
      this.api.readUserKeys().then((userKeys) => {
        this.userKeys$?.next(userKeys);
      });
    }
    return this.userKeys$;
  };

  getUserByUuid = (uuid: string): BehaviorSubject<User | null | undefined> => {
    if (!this.users.has(uuid)) {
      const user$ = new BehaviorSubject<User | null | undefined>(null);
      this.users.set(uuid, user$);
      this.api
        .readUser(uuid)
        .then((user) => {
          user$.next(user);
        })
        .catch((reason) => {
          user$.next(undefined);
        });
    }
    return this.users.get(uuid) as BehaviorSubject<User | null | undefined>;
  };

  createUser = (user: Omit<User, 'uuid' | 'activate' | 'bindcode'>) => {
    this.userKeys$?.complete();
    this.userKeys$ = undefined;
    return this.api.createUser(user);
  };

  patchUser = (user: Omit<User, 'activate' | 'bindcode'>) => {
    this.users.delete(user.uuid);
    this.userKeys$?.complete();
    this.userKeys$ = undefined;
    return this.api.patchUser(user);
  };

  updateUserActivation = (uuid: string, activate: boolean) => {
    this.users.delete(uuid);
    this.userKeys$?.complete();
    this.userKeys$ = undefined;
    return this.api.updateUserActivation(uuid, activate);
  };
}
