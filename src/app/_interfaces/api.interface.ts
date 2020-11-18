import { Observable } from 'rxjs';
import { User, UserPrimarykey } from 'src/app/_interfaces/user.interface';
import { Congregation } from 'src/app/_interfaces/congregation.interface';
import { Tag } from 'src/app/_interfaces/tag.interface';
import { Profile, ProfilePrimarykey } from 'src/app/_interfaces/profile.interface';
import { Status } from 'src/app/_enums/status.enum';

export interface Api {

  readUserPrimarykeys: () => Observable<UserPrimarykey[]>;
  createUserPrimarykey: (userPrimaryke: UserPrimarykey) => Promise<string>;
  updateUserPrimarykey: (userPrimaryke: UserPrimarykey) => Promise<Status>;
  deleteUserPrimarykey: (uuid: string) => Promise<Status>;

  readUser: (uuid: string) => Observable<User>;
  createUser: (user: User) => Promise<Status>;
  updateUser: (user: User) => Promise<Status>;
  deleteUser: (uuid: string) => Promise<Status>;

  readCongregations: () => Observable<Congregation[]>;
  updateCongregations: (congregations: Congregation[]) => Promise<Status>;
  createCongregation: (congregation: Congregation) => Promise<string>;
  updateCongregation: (congregation: Congregation) => Promise<Status>;
  deleteCongregation: (uuid: string) => Promise<Status>;

  readTags: () => Observable<Tag[]>;
  updateTags: (tags: Tag[]) => Promise<Status>;
  createTag: (tags: Tag) => Promise<string>;
  updateTag: (tags: Tag) => Promise<Status>;
  deleteTag: (uuid: string) => Promise<Status>;

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
