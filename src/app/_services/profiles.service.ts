import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Profile, ProfilePrimarykey } from 'src/app/_interfaces/profile.interface';
import { Api } from 'src/app/_api/mock.api';
import { Status } from 'src/app/_enums/status.enum';
import * as ADMINISTRATOR from 'src/assets/default-profiles/profile-administrator.json';
import * as GUEST from 'src/assets/default-profiles/profile-guest.json';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {

  // tslint:disable-next-line: no-string-literal
  private readonly administrator = ADMINISTRATOR['default'] as Profile;
  // tslint:disable-next-line: no-string-literal
  private readonly guest = GUEST['default'] as Profile;

  private profilePrimarykeys$ = new BehaviorSubject<ProfilePrimarykey[]>(null);
  private defaultProfilePrimarykeys$ = new BehaviorSubject<ProfilePrimarykey[]>([
    this.administrator,
    this.guest
  ]);

  private profiles = new Map<string, BehaviorSubject<Profile>>();
  private defaultProfiles = new Map<string, BehaviorSubject<Profile>>([
    [this.administrator.uuid, new BehaviorSubject(this.administrator)],
    [this.guest.uuid, new BehaviorSubject(this.guest)]
  ]);

  private readonly profilesMaxSize = 10;

  constructor(
    private api: Api
  ) { }

  getProfilePrimarykeys = (): BehaviorSubject<ProfilePrimarykey[]> => {
    if (!this.profilePrimarykeys$.getValue()) {
      this.api.readProfilePrimarykeys().pipe(
        map(profilePrimarykeys => this.defaultProfilePrimarykeys$.getValue().concat(profilePrimarykeys))
      ).subscribe(this.profilePrimarykeys$);
    }
    return this.profilePrimarykeys$;
  }

  sortProfilePrimarykeys = (profilePrimarykeys: ProfilePrimarykey[]): Promise<Status> => {
    // remove default profile primarykeys
    const updateProfileprimaykeys = [...profilePrimarykeys];
    this.defaultProfilePrimarykeys$.getValue().forEach(defaultProfilePrimarykey => {
      const index = updateProfileprimaykeys.findIndex(updateProfileprimaykey => {
        return updateProfileprimaykey.uuid === defaultProfilePrimarykey.uuid;
      });
      updateProfileprimaykeys.splice(index, 1);
    });
    return this.api.updateProfilePrimarykeys(updateProfileprimaykeys);
  }

  getProfileByUuid = (uuid: string): BehaviorSubject<Profile> => {
    if (this.defaultProfiles.has(uuid)) {
      return this.defaultProfiles.get(uuid);
    } else if (this.profiles.has(uuid)) {
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
    const defaultProfilePrimarykeys = this.defaultProfilePrimarykeys$.getValue();
    if (profilePrimarykeys) {
      if ( // not exist
        !profilePrimarykeys.find(object => object.name === profile.name) &&
        !defaultProfilePrimarykeys.find(object => object.name === profile.name)
      ) {
        return this.api.createProfilePrimarykey({
          uuid: null,
          name: profile.name,
          order: profile.order
        }).then(uuid => {
          profile.uuid = uuid;
          return this.api.createProfile(profile);
        });
      } else { // existed
        return Promise.reject(Status.EXISTED);
      }
    } else {
      return Promise.reject(Status.NOT_LOADED);
    }
  }

  updateProfile = (profile: Profile): Promise<Status> => {
    const profilePrimarykeys = this.profilePrimarykeys$.getValue();
    const defaultProfilePrimarykeys = this.defaultProfilePrimarykeys$.getValue();
    if (profilePrimarykeys) {
      if (
        !profilePrimarykeys.find(object => object.name === profile.name && object.uuid !== profile.uuid) &&
        !defaultProfilePrimarykeys.find(object => object.name === profile.name && object.uuid !== profile.uuid)
      ) {
        return this.api.updateProfilePrimarykey({
          uuid: profile.uuid,
          name: profile.name,
          order: profile.order
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

  isDefaultProfile = (uuid: string): boolean => {
    return !!this.defaultProfilePrimarykeys$.getValue().find(profilePrimarykey => profilePrimarykey.uuid === uuid);
  }

  private checkProfilesSize = (): void => {
    if ( this.profiles.size > this.profilesMaxSize) {
      const uuid = this.profiles.keys().next().value;
      this.profiles.delete(uuid);
      this.api.unsubscribeStream(uuid);
    }
  }
}
