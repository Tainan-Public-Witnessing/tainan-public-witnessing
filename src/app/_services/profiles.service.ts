import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Profile, ProfilePrimarykey } from 'src/app/_interfaces/profile.interface';
import { Api } from 'src/app/_api/mock.api';
import { Status } from 'src/app/_enums/status.enum';
// @ts-ignore
import * as ADMINISTRATOR from 'src/assets/profiles/profile-administrator.json';
// @ts-ignore
import * as GUEST from 'src/assets/profiles/profile-guest.json';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {

  // tslint:disable-next-line: no-string-literal
  readonly administrator: Profile = ADMINISTRATOR['default'] as Profile;
  // tslint:disable-next-line: no-string-literal
  readonly guest: Profile = GUEST['default'] as Profile;

  private profilePrimarykeys$ = new BehaviorSubject<ProfilePrimarykey[]>(null);
  private defaultProfilePrimarykeys$ = new BehaviorSubject<ProfilePrimarykey[]>([
    // tslint:disable-next-line: no-string-literal
    ADMINISTRATOR['default'],
    // tslint:disable-next-line: no-string-literal
    GUEST['default']
  ]);

  private profiles: Map<string, BehaviorSubject<Profile>> = new Map();
  private defaultProfiles: Map<string, BehaviorSubject<Profile>> = new Map([
    // tslint:disable-next-line: no-string-literal
    [this.administrator.uuid, new BehaviorSubject(ADMINISTRATOR['default'])],
    // tslint:disable-next-line: no-string-literal
    [this.guest.uuid, new BehaviorSubject(GUEST['default'])]
  ]);

  private profilesMaxSize = 10;

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
      this.api.readProfile(uuid).pipe(tap(data => console.log('service get profile', data))).subscribe(profile$);
      this.profiles.set(uuid, profile$);
      this.checkProfilesSize();
      return profile$;
    }
  }

  createProfile = (profile: Profile): Promise<Status> => {
    const profilePrimarykeys = this.profilePrimarykeys$.getValue();
    const defaultProfilePrimarykeys = this.defaultProfilePrimarykeys$.getValue();
    if (profilePrimarykeys) {
      if (
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
      } else {
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

  isDefaultProfile = (uuid: string) => {
    return this.defaultProfilePrimarykeys$.getValue().find(profilePrimarykeys => profilePrimarykeys.uuid === uuid);
  }

  private checkProfilesSize = (): void => {
    if ( this.profiles.size > this.profilesMaxSize) {
      this.profiles.delete(this.profiles.keys().next().value);
    }
  }

}
