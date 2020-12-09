import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Profile, ProfilePrimarykey } from 'src/app/_interfaces/profile.interface';
import { Api } from 'src/app/_api/mock.api';
import { Status } from '../_enums/status.enum';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {

  private profilePrimarykeys$ = new BehaviorSubject<ProfilePrimarykey[]>(null);
  private profiles: Map<string, BehaviorSubject<Profile>> = new Map();
  private profilesMaxSize = 10;

  constructor(
    private api: Api
  ) { }

  getProfilePrimarykeys = (): BehaviorSubject<ProfilePrimarykey[]> => {
    if (!this.profilePrimarykeys$.getValue()) {
      this.api.readProfilePrimarykeys().subscribe(this.profilePrimarykeys$);
    }
    return this.profilePrimarykeys$;
  }

  sortProfilePrimarykeys = (profilePrimarykeys: ProfilePrimarykey[]): Promise<Status> => {
    return this.api.updateProfilePrimarykeys(profilePrimarykeys);
  }

  getProfileByUuid = (uuid: string): BehaviorSubject<Profile> => {
    if (this.profiles.has(uuid)) {
      return this.profiles.get(uuid);
    } else {
      const profile$ = new BehaviorSubject<Profile>(null);
      this.api.readProfile(uuid).subscribe(profile$);
      this.profiles.set(uuid, profile$);
      this.checkProfilesSize();
      return profile$;
    }
  }

  createProfile = (profile: Profile): Promise<Status> => {
    const profilePrimarykeys = this.profilePrimarykeys$.getValue();
    if (profilePrimarykeys) {
      if (!profilePrimarykeys.find(object => object.name === profile.name)) {
        return this.api.createProfilePrimarykey({
          uuid: null,
          name: profile.name
        }).then(uuid => {
          profile.uuid = uuid;
          return this.api.createProfile(profile);
        });
      } else {
        return Promise.reject(Status.EXISTED);
      }
    } else {
      return Promise.reject(Status.NOT_LOADED);
    }
  }

  updateProfile = (profile: Profile): Promise<Status> => {
    const profilePrimarykeys = this.profilePrimarykeys$.getValue();
    if (profilePrimarykeys) {
      if (!profilePrimarykeys.find(object => object.name === profile.name && object.uuid !== profile.uuid)) {
        return this.api.updateProfilePrimarykey({
          uuid: profile.uuid,
          name: profile.name
        }).then(() => {
          return this.api.updateProfile(profile);
        });
      } else {
        return Promise.reject(Status.EXISTED);
      }
    } else {
      return Promise.reject(Status.NOT_LOADED);
    }
  }

  deleteProfile = (uuid: string): Promise<Status> => {
    return this.api.deleteProfilePrimarykey(uuid).then(() => {
      return this.api.deleteProfile(uuid);
    });
  }

  private checkProfilesSize = (): void => {
    if ( this.profiles.size > this.profilesMaxSize) {
      this.profiles.delete(this.profiles.keys().next().value);
    }
  }
}
