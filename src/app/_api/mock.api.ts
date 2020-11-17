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
import { Status } from '../_enums/status.enum';

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
