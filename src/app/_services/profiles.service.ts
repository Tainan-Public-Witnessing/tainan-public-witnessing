import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Profile, ProfilePrimarykey, PermissionData } from 'src/app/_interfaces/profile.interface';
import { MockApi } from 'src/app/_api/mock.api';
import { PermissionKey } from 'src/app/_enums/permission-key.enum';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {

  profilePrimarykeys$ = new BehaviorSubject<ProfilePrimarykey[]>(null);
  // profiles: BehaviorSubject<Profile>[] = [];
  profiles: Map<string, BehaviorSubject<Profile>> = new Map();

  PERMISSION_DATAS: PermissionData[] = [
    { key: PermissionKey.HOME_READ, urlKey: '/home', description: 'Can read Home page' },
    { key: PermissionKey.CONGREGATIONS_READ, urlKey: '/congregations', description: 'Can read Congregations page' },
    { key: PermissionKey.USERS_READ, urlKey: '/users', description: 'Can read users page' },
    { key: PermissionKey.TAGS_READ, urlKey: '/tags', description: 'Can read Tags page' },
    { key: PermissionKey.PROFILES_READ, urlKey: '/profiles', description: 'Can read Profiles page' },
    { key: PermissionKey.PROFILE_READ, urlKey: '/profile/read', description: 'Can read Profile page' },
  ];

  constructor(
    private mockApi: MockApi
  ) { }

  loadProfilePrimarykeys = () => {
    if (!this.profilePrimarykeys$.getValue()) {
      this.mockApi.readProfilePrimarykeys().subscribe(this.profilePrimarykeys$);
    }
  }

  sortProfilePrimarykeys = (profilePrimarykeys: ProfilePrimarykey[]) => {
    return this.mockApi.sortProfilePrimarykeys(profilePrimarykeys);
  }

  loadProfileByUuid = (uuid: string): BehaviorSubject<Profile> => {
    if (this.profiles.has(uuid)) {
      return this.profiles.get(uuid);
    } else {
      const profile$ = new BehaviorSubject<Profile>(null);
      this.mockApi.readProfile(uuid).subscribe(profile$);
      this.profiles.set(uuid, profile$);
      return profile$;
    }
  }

  createProfile = (profile: Profile): Promise<string> => {
    const profilePrimarykeys = this.profilePrimarykeys$.getValue();
    if (profilePrimarykeys) {
      if (!profilePrimarykeys.find(object => object.name === profile.name)) {
        return this.mockApi.createProfilePrimarykey({
          uuid: null,
          name: profile.name
        }).then(uuid => {
          profile.uuid = uuid;
          return this.mockApi.createProfile(profile);
        });
      } else {
        return Promise.reject('PROFILE_NAME_EXISTED');
      }
    } else {
      return Promise.reject('PROFILE_PRIMARY_KEYS_NOT_LOADED');
    }
  }

  updateProfile = (profile: Profile): Promise<string> => {
    const profilePrimarykeys = this.profilePrimarykeys$.getValue();
    if (profilePrimarykeys) {
      if (!profilePrimarykeys.find(object => object.name === profile.name && object.uuid !== profile.uuid)) {
        return this.mockApi.updateProfilePrimarykey({
          uuid: profile.uuid,
          name: profile.name
        }).then(uuid => {
          return this.mockApi.updateProfile(profile);
        });
      } else {
        return Promise.reject('PROFILE_NAME_EXISTED');
      }
    } else {
      return Promise.reject('PROFILE_PRIMARY_KEYS_NOT_LOADED');
    }
  }

  deleteProfile = (uuid: string) => {
    return this.mockApi.deleteProfilePrimarykey(uuid).then(deletedUuid => {
      return this.mockApi.deleteProfile(deletedUuid);
    });
  }
}
