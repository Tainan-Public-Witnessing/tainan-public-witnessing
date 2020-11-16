import { BehaviorSubject, Observable } from 'rxjs';
import { UserPrimarykey } from 'src/app/_interfaces/user.interface';
import { Congregation } from 'src/app/_interfaces/congregation.interface';
import { Tag } from 'src/app/_interfaces/tag.interface';
import { Profile, ProfilePrimarykey } from 'src/app/_interfaces/profile.interface';
import { Status } from 'src/app/_enums/status.enum';

export interface Api {

  readUserPrimarykeys: () => Observable<UserPrimarykey[]>;
  createUserPrimarykey: (userPrimaryke: UserPrimarykey) => void;
  updateUserPrimarykey: (userPrimaryke: UserPrimarykey) => void;
  deleteUserPrimarykey: (uuid: string) => void;

  readCongregations: () => Observable<Congregation[]>;
  sortCongregations: (congregations: Congregation[]) => Promise<string>;
  createCongregation: (congregation: Congregation) => Promise<string>;
  updateCongregation: (congregation: Congregation) => Promise<string>;
  deleteCongregation: (uuid: string) => Promise<string>;

  readTags: () => Observable<Tag[]>;
  sortTags: (tags: Tag[]) => Promise<string>;
  createTag: (tags: Tag) => Promise<string>;
  updateTag: (tags: Tag) => Promise<string>;
  deleteTag: (uuid: string) => Promise<string>;

  readProfilePrimarykeys: () => Observable<ProfilePrimarykey[]>;
  updateProfilePrimarykeys: (profilePrimarykeys: ProfilePrimarykey[]) => Promise<Status>;
  createProfilePrimarykey: (profilePrimarykey: ProfilePrimarykey) => Promise<string>;
  updateProfilePrimarykey: (profilePrimarykey: ProfilePrimarykey) => Promise<Status>;
  deleteProfilePrimarykey: (uuid: string) => Promise<Status>;

  readProfile: (uuid: string) => Observable<Profile>;
  createProfile: (profile: Profile) => Promise<Status>;
  updateProfile: (profile: Profile) => Promise<Status>;
  deleteProfile: (uuid: string) => Promise<Status>;
}
