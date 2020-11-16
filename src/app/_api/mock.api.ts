import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v5 as uuidv5 } from 'uuid';
import { environment } from 'src/environments/environment';
import { Api } from 'src/app/_interfaces/api.interface';
import { UserPrimarykey } from 'src/app/_interfaces/user.interface';
import { Congregation } from 'src/app/_interfaces/congregation.interface';
import { Tag } from 'src/app/_interfaces/tag.interface';
import { Profile, ProfilePrimarykey } from 'src/app/_interfaces/profile.interface';
import { map } from 'rxjs/operators';
import { PermissionKey } from '../_enums/permission-key.enum';

@Injectable({
  providedIn: 'root'
})
export class MockApi implements Api {

  /** mock data */

  private userPrimarykeys$ = new BehaviorSubject<UserPrimarykey[]>([
    { uuid: 'e90966a2-91a8-5480-bc02-67f88277e5f8', username: 'John' },
  ]);

  private congregations$ = new BehaviorSubject<Congregation[]>([
    { uuid: 'e90966a2-91a8-5480-bc02-67f88277e5f7', name: 'EastTainan' },
    { uuid: 'e90966a2-91a8-5480-bc02-67f88277e5f8', name: 'NorthTainan' },
    { uuid: 'e90966a2-91a8-5480-bc02-67f88277e5f9', name: 'WestTainan' },
    { uuid: 'e90966a2-91a8-5480-bc02-67f88277e5f0', name: 'SouthTainan' },
  ]);

  private tags$ = new BehaviorSubject<Tag[]>([
    { uuid: 'e90966a2-91a8-5480-bc02-67f88277e5a0', name: 'overseer' },
    { uuid: 'e90966a2-91a8-5480-bc02-67f88277e5a1', name: 'elder' },
    { uuid: 'e90966a2-91a8-5480-bc02-67f88277e5a2', name: 'pioneer' },
  ]);

  private profilePrimarykeys$ = new BehaviorSubject<ProfilePrimarykey[]>([
    { uuid: 'e90966a2-91a8-5480-bc02-64f88277e5a1', name: 'administrator' },
  ]);

  private profiles$ = new BehaviorSubject<Profile[]>([{
    uuid: 'e90966a2-91a8-5480-bc02-64f88277e5a1',
    name: 'administrator',
    permissions: [
      { key: PermissionKey.HOME_READ, access: true },
      { key: PermissionKey.CONGREGATIONS_READ, access: true },
      { key: PermissionKey.USERS_READ, access: true },
      { key: PermissionKey.TAGS_READ, access: true },
      { key: PermissionKey.PROFILES_READ, access: true },
      { key: PermissionKey.PROFILE_READ, access: true },
    ]
  }]);

  /** user uuid map */

  readUserPrimarykeys = () => {
    return this.userPrimarykeys$;
  }

  createUserPrimarykey = (userPrimarykey: UserPrimarykey) => {
    const userUuidMap = this.userPrimarykeys$.getValue();
    userPrimarykey.uuid = uuidv5(userPrimarykey.username, environment.UUID_NAMESPACE);
    userUuidMap.push(userPrimarykey);
    this.userPrimarykeys$.next(userUuidMap);
  }

  updateUserPrimarykey = (userPrimarykey: UserPrimarykey) => {
    const userUuidMap = this.userPrimarykeys$.getValue();
    const existObject = userUuidMap.find(object => object.uuid === userPrimarykey.uuid);
    if (existObject) {
      for (const index of Object.keys(existObject)) {
        existObject[index] = userPrimarykey[index];
      }
      this.userPrimarykeys$.next(userUuidMap);
    }
  }

  deleteUserPrimarykey = (uuid: string) => {
    const userUuidMap = this.userPrimarykeys$.getValue();
    const existIndex = userUuidMap.findIndex(item => item.uuid === uuid);
    if (existIndex !== -1) {
      userUuidMap.splice(existIndex, 1);
      this.userPrimarykeys$.next(userUuidMap);
    }
  }

  /** congregations */

  readCongregations = () => {
    return this.congregations$;
  }

  sortCongregations = (congregations: Congregation[]) => {
    this.congregations$.next(congregations);
    return Promise.resolve('SUCCESS');
  }

  createCongregation = (congregation: Congregation) => {
    const congregations = this.congregations$.getValue();
    congregation.uuid = uuidv5(congregation.name, environment.UUID_NAMESPACE);
    congregations.push(congregation);
    this.congregations$.next(congregations);
    return Promise.resolve('SUCCESS');
  }

  updateCongregation = (congregation: Congregation) => {
    const congregations = this.congregations$.getValue();
    const existObject = congregations.find(object => object.uuid === congregation.uuid);
    if (existObject) {
      for (const index of Object.keys(existObject)) {
        existObject[index] = congregation[index];
      }
      this.congregations$.next(congregations);
    } else {
      return Promise.reject('CONGREGATION_DO_NOT_EXIST');
    }
    return Promise.resolve('SUCCESS');
  }

  deleteCongregation = (uuid: string) => {
    const congregations = this.congregations$.getValue();
    const existIndex = congregations.findIndex(object => object.uuid === uuid);
    if (existIndex !== -1) {
      congregations.splice(existIndex, 1);
      this.congregations$.next(congregations);
    } else {
      return Promise.reject('CONGREGATION_DO_NOT_EXIST');
    }
    return Promise.resolve('SUCCESS');
  }

  /** tags */

  readTags = () => {
    return this.tags$;
  }

  sortTags = (tags: Tag[]) => {
    this.tags$.next(tags);
    return Promise.resolve('SUCCESS');
  }

  createTag = (tag: Tag) => {
    const tags = this.tags$.getValue();
    tag.uuid = uuidv5(tag.name, environment.UUID_NAMESPACE);
    tags.push(tag);
    this.congregations$.next(tags);
    return Promise.resolve('SUCCESS');
  }

  updateTag = (tag: Tag) => {
    const tags = this.tags$.getValue();
    const existObject = tags.find(object => object.uuid === tag.uuid);
    if (existObject) {
      for (const index of Object.keys(existObject)) {
        existObject[index] = tag[index];
      }
      this.tags$.next(tags);
    } else {
      return Promise.reject('TAG_DO_NOT_EXIST');
    }
    return Promise.resolve('SUCCESS');
  }

  deleteTag = (uuid: string) => {
    const tags = this.tags$.getValue();
    const existIndex = tags.findIndex(object => object.uuid === uuid);
    if (existIndex !== -1) {
      tags.splice(existIndex, 1);
      this.congregations$.next(tags);
    } else {
      return Promise.reject('TAG_DO_NOT_EXIST');
    }
    return Promise.resolve('SUCCESS');
  }

  /** profile primary key */

  readProfilePrimarykeys = () => {
    return this.profilePrimarykeys$;
  }

  sortProfilePrimarykeys = (profilePrimarykeys: ProfilePrimarykey[]) => {
    this.profilePrimarykeys$.next(profilePrimarykeys);
    return Promise.resolve('SUCCESS');
  }

  createProfilePrimarykey = (profilePrimarykey: ProfilePrimarykey) => {
    const profilePrimarykeys = this.profilePrimarykeys$.getValue();
    profilePrimarykey.uuid = uuidv5(profilePrimarykey.name, environment.UUID_NAMESPACE);
    profilePrimarykeys.push(profilePrimarykey);
    this.profilePrimarykeys$.next(profilePrimarykeys);
    return Promise.resolve(profilePrimarykey.uuid);
  }

  updateProfilePrimarykey = (profilePrimarykey: ProfilePrimarykey) => {
    const profilePrimarykeys = this.profilePrimarykeys$.getValue();
    const existObject = profilePrimarykeys.find(object => object.uuid === profilePrimarykey.uuid);
    if (existObject) {
      for (const index of Object.keys(existObject)) {
        existObject[index] = profilePrimarykey[index];
      }
      this.profilePrimarykeys$.next(profilePrimarykeys);
    } else {
      return Promise.reject('PROFILE_PRIMARYKEY_DO_NOT_EXIST');
    }
    return Promise.resolve('SUCCESS');
  }

  deleteProfilePrimarykey = (uuid: string) => {
    const profilePrimarykeys = this.profilePrimarykeys$.getValue();
    const existIndex = profilePrimarykeys.findIndex(object => object.uuid === uuid);
    if (existIndex !== -1) {
      profilePrimarykeys.splice(existIndex, 1);
      this.profilePrimarykeys$.next(profilePrimarykeys);
      return Promise.resolve(uuid);
    } else {
      return Promise.reject('PROFILE_PRIMARYKEY_DO_NOT_EXIST');
    }
  }

  /** profile */

  readProfile = (uuid: string) => {
    return this.profiles$.pipe(
      map(profiles => profiles.find(profile => profile.uuid === uuid))
    );
  }

  createProfile = (profile: Profile) => {
    const profiles = this.profiles$.getValue();
    profiles.push(profile);
    this.profiles$.next(profiles);
    return Promise.resolve('SUCCESS');
  }

  updateProfile = (profile: Profile) => {
    const profiles = this.profiles$.getValue();
    const existObject = profiles.find(object => object.uuid === profile.uuid);
    if (existObject) {
      for (const index of Object.keys(existObject)) {
        existObject[index] = profile[index];
      }
      this.profiles$.next(profiles);
    } else {
      return Promise.reject('PROFILE_DO_NOT_EXIST');
    }
    return Promise.resolve('SUCCESS');
  }

  deleteProfile = (uuid: string) => {
    const profiles = this.profiles$.getValue();
    const existIndex = profiles.findIndex(object => object.uuid === uuid);
    if (existIndex !== -1) {
      profiles.splice(existIndex, 1);
      this.profiles$.next(profiles);
    } else {
      return Promise.reject('PROFILE_DO_NOT_EXIST');
    }
    return Promise.resolve('SUCCESS');
  }
}
