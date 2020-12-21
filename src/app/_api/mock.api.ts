import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v5 as uuidv5 } from 'uuid';
import { environment } from 'src/environments/environment';
import { ApiInterface, UserAuthorityStatus } from 'src/app/_interfaces/api.interface';
import { User, UserPrimarykey } from 'src/app/_interfaces/user.interface';
import { Congregation } from 'src/app/_interfaces/congregation.interface';
import { Tag } from 'src/app/_interfaces/tag.interface';
import { Profile, ProfilePrimarykey } from 'src/app/_interfaces/profile.interface';
import { map } from 'rxjs/operators';
import { PermissionKey } from 'src/app/_enums/permission-key.enum';
import { Status } from 'src/app/_enums/status.enum';
import { Gender } from 'src/app/_enums/gender.enum';

@Injectable({
  providedIn: 'root'
})
export class Api implements ApiInterface {

  /** mock data */

  private userAuthorityStatuses$ = new BehaviorSubject<UserAuthorityStatus[]>([
    { uuid: 'e90966a2-91a8-5480-bc02-67f88277e5f8', password: '7f15fa00-23ef-5e5c-9365-50de9d7e1ca5', online: false },
    { uuid: 'e90966a2-91a8-5480-bc02-60f88277e5f8', password: '36e52acf-1879-5f09-9f64-56ef4a2d2145', online: false },
  ]);

  private userPrimarykeys$ = new BehaviorSubject<UserPrimarykey[]>([
    { uuid: 'e90966a2-91a8-5480-bc02-67f88277e5f8', username: 'John' },
    { uuid: 'e90966a2-91a8-5480-bc02-60f88277e5f8', username: 'Peter' },
  ]);

  private users$ = new BehaviorSubject<User[]>([
    {
      uuid: 'e90966a2-91a8-5480-bc02-67f88277e5f8',
      username: 'John',
      name: 'John Smith',
      gender: Gender.MAN,
      congregation: 'e90966a2-91a8-5480-bc02-67f88277e5f7',
      profile: 'e90966a2-91a8-5480-bc02-64f88277e5a1',
      cellphone: '0987654321',
      phone: '0987654321',
      address: 'Earth',
      note: 'Nice guy',
      tags: ['e90966a2-91a8-5480-bc02-67f88277e5a1', 'e90966a2-91a8-5480-bc02-67f88277e5a2']
    },
    {
      uuid: 'e90966a2-91a8-5480-bc02-60f88277e5f8',
      username: 'Peter',
      name: 'Peter Hi',
      gender: Gender.MAN,
      congregation: 'e90966a2-91a8-5480-bc02-67f88277e5f0',
      profile: 'e90966a2-91c8-5480-bc02-64f88277e5a1',
      cellphone: '0987654321',
      phone: '0987654321',
      address: 'Earth',
      note: 'Nice guy',
      tags: ['e90966a2-91a8-5480-bc02-67f88277e5a2']
    }
  ]);

  private congregations$ = new BehaviorSubject<Congregation[]>([
    { uuid: 'e90966a2-91a8-5480-bc02-67f88277e5f7', name: 'EastTainan', order: 0 },
    { uuid: 'e90966a2-91a8-5480-bc02-67f88277e5f8', name: 'NorthTainan', order: 1 },
    { uuid: 'e90966a2-91a8-5480-bc02-67f88277e5f9', name: 'WestTainan', order: 2 },
    { uuid: 'e90966a2-91a8-5480-bc02-67f88277e5f0', name: 'SouthTainan', order: 3 },
  ]);

  private tags$ = new BehaviorSubject<Tag[]>([
    { uuid: 'e90966a2-91a8-5480-bc02-67f88277e5a0', name: 'overseer', order: 0 },
    { uuid: 'e90966a2-91a8-5480-bc02-67f88277e5a1', name: 'elder', order: 1 },
    { uuid: 'e90966a2-91a8-5480-bc02-67f88277e5a2', name: 'pioneer', order: 2 },
  ]);

  private profilePrimarykeys$ = new BehaviorSubject<ProfilePrimarykey[]>([
    { uuid: 'e90966a2-91a8-5480-bc02-64f88277e5a1', name: 'administrator', order: 0 },
    { uuid: 'e90966a2-91c8-5480-bc02-64f88277e5a1', name: 'manager', order: 1 },
  ]);

  private profiles$ = new BehaviorSubject<Profile[]>([
    {
      uuid: 'e90966a2-91a8-5480-bc02-64f88277e5a1',
      name: 'administrator',
      order: 0,
      permissions: [
        { key: PermissionKey.HOME_READ, access: true },
        { key: PermissionKey.CONGREGATIONS_READ, access: true },
        { key: PermissionKey.CONGREGATIONS_SORT, access: true },
        { key: PermissionKey.CONGREGATION_CREATE, access: true },
        { key: PermissionKey.CONGREGATION_UPDATE, access: true },
        { key: PermissionKey.CONGREGATION_DELETE, access: true },
        { key: PermissionKey.USERS_READ, access: true },
        { key: PermissionKey.USER_READ, access: true },
        { key: PermissionKey.USER_CREATE, access: true },
        { key: PermissionKey.USER_UPDATE, access: true },
        { key: PermissionKey.USER_DELETE, access: true },
        { key: PermissionKey.TAGS_READ, access: true },
        { key: PermissionKey.TAGS_SORT, access: true },
        { key: PermissionKey.TAG_CREATE, access: true },
        { key: PermissionKey.TAG_UPDATE, access: true },
        { key: PermissionKey.TAG_DELETE, access: true },
        { key: PermissionKey.PROFILES_READ, access: true },
        { key: PermissionKey.PROFILES_SORT, access: true },
        { key: PermissionKey.PROFILE_READ, access: true },
        { key: PermissionKey.PROFILE_CREATE, access: true },
        { key: PermissionKey.PROFILE_UPDATE, access: true },
        { key: PermissionKey.PROFILE_DELETE, access: true },
      ]
    },
    {
      uuid: 'e90966a2-91c8-5480-bc02-64f88277e5a1',
      name: 'manager',
      order: 1,
      permissions: [
        { key: PermissionKey.HOME_READ, access: true },
        { key: PermissionKey.CONGREGATIONS_READ, access: true },
        { key: PermissionKey.CONGREGATIONS_SORT, access: false },
        { key: PermissionKey.CONGREGATION_CREATE, access: false },
        { key: PermissionKey.CONGREGATION_UPDATE, access: false },
        { key: PermissionKey.CONGREGATION_DELETE, access: false },
        { key: PermissionKey.USERS_READ, access: true },
        { key: PermissionKey.USER_READ, access: true },
        { key: PermissionKey.USER_CREATE, access: false },
        { key: PermissionKey.USER_UPDATE, access: false },
        { key: PermissionKey.USER_DELETE, access: false },
        { key: PermissionKey.TAGS_READ, access: true },
        { key: PermissionKey.TAGS_SORT, access: false },
        { key: PermissionKey.TAG_CREATE, access: false },
        { key: PermissionKey.TAG_UPDATE, access: false },
        { key: PermissionKey.TAG_DELETE, access: false },
        { key: PermissionKey.PROFILES_READ, access: true },
        { key: PermissionKey.PROFILES_SORT, access: false },
        { key: PermissionKey.PROFILE_READ, access: true },
        { key: PermissionKey.PROFILE_CREATE, access: false },
        { key: PermissionKey.PROFILE_UPDATE, access: false },
        { key: PermissionKey.PROFILE_DELETE, access: false },
      ]
    }
  ]);

  unsubscribeStream = (key: string) => {
    return;
  }

  unsubsctibeStreams = () => {
    return;
  }

  /** authority */
  login = (uuid: string, password: string) => {
    console.log('api', 'login');
    const userAuthorityStatuses = this.userAuthorityStatuses$.getValue();
    const existObject = userAuthorityStatuses.find(object => object.uuid === uuid);
    if (existObject) {
      if (existObject.password === uuidv5(password, environment.UUID_NAMESPACE)) {
        existObject.online = true;
        return Promise.resolve(Status.SUCCESS);
      } else {
        return Promise.reject(Status.WRONG_PASSWORD);
      }
    } else {
      return Promise.reject(Status.NOT_EXIST);
    }
  }

  logout = (uuid: string) => {
    console.log('api', 'logout');
    const userAuthorityStatuses = this.userAuthorityStatuses$.getValue();
    const existObject = userAuthorityStatuses.find(object => object.uuid === uuid);
    if (existObject) {
      existObject.online = false;
      return Promise.resolve(Status.SUCCESS);
    } else {
      return Promise.reject(Status.NOT_EXIST);
    }
  }

  /** user uuid map */

  readUserPrimarykeys = () => {
    console.log('api', 'readUserPrimarykeys');
    return this.userPrimarykeys$;
  }

  createUserPrimarykey = (userPrimarykey: UserPrimarykey) => {
    console.log('api', 'createUserPrimarykey');
    const userPrimarykeys = this.userPrimarykeys$.getValue();
    userPrimarykey.uuid = uuidv5(new Date().toString(), environment.UUID_NAMESPACE);
    userPrimarykeys.push(userPrimarykey);
    this.userPrimarykeys$.next(userPrimarykeys);
    return Promise.resolve(userPrimarykey.uuid);
  }

  updateUserPrimarykey = (userPrimarykey: UserPrimarykey) => {
    console.log('api', 'updateUserPrimarykey');
    const userPrimarykeys = this.userPrimarykeys$.getValue();
    const existObject = userPrimarykeys.find(object => object.uuid === userPrimarykey.uuid);
    if (existObject) {
      for (const index of Object.keys(existObject)) {
        existObject[index] = userPrimarykey[index];
      }
      this.userPrimarykeys$.next(userPrimarykeys);
      return Promise.resolve(Status.SUCCESS);
    } else {
      return Promise.reject(Status.NOT_EXIST);
    }
  }

  deleteUserPrimarykey = (uuid: string) => {
    console.log('api', 'deleteUserPrimarykey');
    const userPrimarykeys = this.userPrimarykeys$.getValue();
    const existIndex = userPrimarykeys.findIndex(item => item.uuid === uuid);
    if (existIndex !== -1) {
      userPrimarykeys.splice(existIndex, 1);
      this.userPrimarykeys$.next(userPrimarykeys);
      return Promise.resolve(Status.SUCCESS);
    } else {
      return Promise.reject(Status.NOT_EXIST);
    }
  }

  readUser = (uuid: string) => {
    console.log('api', 'readUser');
    return this.users$.pipe(
      map(users => users.find(user => user.uuid === uuid))
    );
  }

  createUser = (user: User) => {
    console.log('api', 'createUser');
    const users = this.users$.getValue();
    users.push(user);
    this.users$.next(users);
    return Promise.resolve(Status.SUCCESS);
  }

  updateUser = (user: User) => {
    console.log('api', 'updateUser');
    const users = this.users$.getValue();
    const existObject = users.find(object => object.uuid === user.uuid);
    if (existObject) {
      for (const index of Object.keys(existObject)) {
        existObject[index] = user[index];
      }
      this.users$.next(users);
      return Promise.resolve(Status.SUCCESS);
    } else {
      return Promise.reject(Status.NOT_EXIST);
    }
  }

  deleteUser = (uuid: string) => {
    console.log('api', 'deleteUser');
    const users = this.users$.getValue();
    const existIndex = users.findIndex(object => object.uuid === uuid);
    if (existIndex !== -1) {
      users.splice(existIndex, 1);
      this.users$.next(users);
      return Promise.resolve(Status.SUCCESS);
    } else {
      return Promise.reject(Status.NOT_EXIST);
    }
  }

  /** congregations */

  readCongregations = () => {
    console.log('api', 'readCongregations');
    return this.congregations$;
  }

  updateCongregations = (congregations: Congregation[]) => {
    console.log('api', 'updateCongregations');
    this.congregations$.next(congregations);
    return Promise.resolve(Status.SUCCESS);
  }

  createCongregation = (congregation: Congregation) => {
    console.log('api', 'createCongregation');
    const congregations = this.congregations$.getValue();
    congregation.uuid = uuidv5(new Date().toString(), environment.UUID_NAMESPACE);
    congregations.push(congregation);
    this.congregations$.next(congregations);
    return Promise.resolve(congregation.uuid);
  }

  updateCongregation = (congregation: Congregation) => {
    console.log('api', 'updateCongregation');
    const congregations = this.congregations$.getValue();
    const existObject = congregations.find(object => object.uuid === congregation.uuid);
    if (existObject) {
      for (const index of Object.keys(existObject)) {
        existObject[index] = congregation[index];
      }
      this.congregations$.next(congregations);
      return Promise.resolve(Status.SUCCESS);
    } else {
      return Promise.reject(Status.NOT_EXIST);
    }
  }

  deleteCongregation = (uuid: string) => {
    console.log('api', 'deleteCongregation');
    const congregations = this.congregations$.getValue();
    const existIndex = congregations.findIndex(object => object.uuid === uuid);
    if (existIndex !== -1) {
      congregations.splice(existIndex, 1);
      this.congregations$.next(congregations);
      return Promise.resolve(Status.SUCCESS);
    } else {
      return Promise.reject(Status.NOT_EXIST);
    }
  }

  /** tags */

  readTags = () => {
    console.log('api', 'readTags');
    return this.tags$;
  }

  updateTags = (tags: Tag[]) => {
    console.log('api', 'updateTags');
    this.tags$.next(tags);
    return Promise.resolve(Status.SUCCESS);
  }

  createTag = (tag: Tag) => {
    console.log('api', 'createTag');
    const tags = this.tags$.getValue();
    tag.uuid = uuidv5(new Date().toString(), environment.UUID_NAMESPACE);
    tags.push(tag);
    this.tags$.next(tags);
    return Promise.resolve(tag.uuid);
  }

  updateTag = (tag: Tag) => {
    console.log('api', 'updateTag');
    const tags = this.tags$.getValue();
    const existObject = tags.find(object => object.uuid === tag.uuid);
    if (existObject) {
      for (const index of Object.keys(existObject)) {
        existObject[index] = tag[index];
      }
      this.tags$.next(tags);
      return Promise.resolve(Status.SUCCESS);
    } else {
      return Promise.reject(Status.NOT_EXIST);
    }
  }

  deleteTag = (uuid: string) => {
    console.log('api', 'deleteTag');
    const tags = this.tags$.getValue();
    const existIndex = tags.findIndex(object => object.uuid === uuid);
    if (existIndex !== -1) {
      tags.splice(existIndex, 1);
      this.congregations$.next(tags);
      return Promise.resolve(Status.SUCCESS);
    } else {
      return Promise.reject(Status.NOT_EXIST);
    }
  }

  /** profile primary key */

  readProfilePrimarykeys = () => {
    console.log('api', 'readProfilePrimarykeys');
    return this.profilePrimarykeys$;
  }

  updateProfilePrimarykeys = (profilePrimarykeys: ProfilePrimarykey[]) => {
    console.log('api', 'updateProfilePrimarykeys');
    this.profilePrimarykeys$.next(profilePrimarykeys);
    return Promise.resolve(Status.SUCCESS);
  }

  /**
   * @returns uuid: string
   */
  createProfilePrimarykey = (profilePrimarykey: ProfilePrimarykey) => {
    console.log('api', 'createProfilePrimarykey');
    const profilePrimarykeys = this.profilePrimarykeys$.getValue();
    profilePrimarykey.uuid = uuidv5(new Date().toString(), environment.UUID_NAMESPACE);
    profilePrimarykeys.push(profilePrimarykey);
    this.profilePrimarykeys$.next(profilePrimarykeys);
    return Promise.resolve(profilePrimarykey.uuid);
  }

  updateProfilePrimarykey = (profilePrimarykey: ProfilePrimarykey) => {
    console.log('api', 'updateProfilePrimarykey');
    const profilePrimarykeys = this.profilePrimarykeys$.getValue();
    const existObject = profilePrimarykeys.find(object => object.uuid === profilePrimarykey.uuid);
    if (existObject) {
      for (const index of Object.keys(existObject)) {
        existObject[index] = profilePrimarykey[index];
      }
      this.profilePrimarykeys$.next(profilePrimarykeys);
      return Promise.resolve(Status.SUCCESS);
    } else {
      return Promise.reject(Status.NOT_EXIST);
    }
  }

  deleteProfilePrimarykey = (uuid: string) => {
    console.log('api', 'deleteProfilePrimarykey');
    const profilePrimarykeys = this.profilePrimarykeys$.getValue();
    const existIndex = profilePrimarykeys.findIndex(object => object.uuid === uuid);
    if (existIndex !== -1) {
      profilePrimarykeys.splice(existIndex, 1);
      this.profilePrimarykeys$.next(profilePrimarykeys);
      return Promise.resolve(Status.SUCCESS);
    } else {
      return Promise.reject(Status.NOT_EXIST);
    }
  }

  /** profile */

  readProfile = (uuid: string) => {
    console.log('api', 'readProfile');
    return this.profiles$.pipe(
      map(profiles => profiles.find(profile => profile.uuid === uuid))
    );
  }

  createProfile = (profile: Profile) => {
    console.log('api', 'createProfile');
    const profiles = this.profiles$.getValue();
    profiles.push(profile);
    this.profiles$.next(profiles);
    return Promise.resolve(Status.SUCCESS);
  }

  updateProfile = (profile: Profile) => {
    console.log('api', 'updateProfile');
    const profiles = this.profiles$.getValue();
    const existObject = profiles.find(object => object.uuid === profile.uuid);
    if (existObject) {
      for (const index of Object.keys(existObject)) {
        existObject[index] = profile[index];
      }
      this.profiles$.next(profiles);
      return Promise.resolve(Status.SUCCESS);
    } else {
      return Promise.reject(Status.NOT_EXIST);
    }
  }

  deleteProfile = (uuid: string) => {
    console.log('api', 'deleteProfile');
    const profiles = this.profiles$.getValue();
    const existIndex = profiles.findIndex(object => object.uuid === uuid);
    if (existIndex !== -1) {
      profiles.splice(existIndex, 1);
      this.profiles$.next(profiles);
      return Promise.resolve(Status.SUCCESS);
    } else {
      return Promise.reject(Status.NOT_EXIST);
    }
  }
}
