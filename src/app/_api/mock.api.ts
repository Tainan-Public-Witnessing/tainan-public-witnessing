import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v5 as uuidv5 } from 'uuid';
import { environment } from 'src/environments/environment';
import { Api } from 'src/app/_interfaces/api.interface';
import { UserUuidMapItem } from 'src/app/_interfaces/user.interface';
import { Congregation } from 'src/app/_interfaces/congregation.interface';
import { Tag } from 'src/app/_interfaces/tag.interface';

@Injectable({
  providedIn: 'root'
})
export class MockApi implements Api {

  /** mock data */

  private userUuidMap$ = new BehaviorSubject<UserUuidMapItem[]>([
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

  /** user uuid map */

  readUserUuidMap = () => {
    return this.userUuidMap$;
  }

  createUserUuidMapItem = (userUuidMapItem: UserUuidMapItem) => {
    const userUuidMap = this.userUuidMap$.getValue();
    userUuidMapItem.uuid = uuidv5(userUuidMapItem.username, environment.UUID_NAMESPACE);
    userUuidMap.push(userUuidMapItem);
    this.userUuidMap$.next(userUuidMap);
  }

  updateUserUuidMapItem = (userUuidMapItem: UserUuidMapItem) => {
    const userUuidMap = this.userUuidMap$.getValue();
    const existObject = userUuidMap.find(object => object.uuid === userUuidMapItem.uuid);
    if (existObject) {
      for (const index of Object.keys(existObject)) {
        existObject[index] = userUuidMapItem[index];
      }
      this.userUuidMap$.next(userUuidMap);
    }
  }

  deleteUserUuidMapItem = (uuid: string) => {
    const userUuidMap = this.userUuidMap$.getValue();
    const existIndex = userUuidMap.findIndex(item => item.uuid === uuid);
    if (existIndex !== -1) {
      userUuidMap.splice(existIndex, 1);
      this.userUuidMap$.next(userUuidMap);
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
}
