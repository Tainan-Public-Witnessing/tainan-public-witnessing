import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { v5 as uuidv5 } from 'uuid';
import { ApiInterface, UserAuthorityStatus } from 'src/app/_interfaces/api.interface';
import { User, UserPrimarykey } from 'src/app/_interfaces/user.interface';
import { Congregation } from 'src/app/_interfaces/congregation.interface';
import { Tag } from 'src/app/_interfaces/tag.interface';
import { Profile, ProfilePrimarykey } from 'src/app/_interfaces/profile.interface';
import { Status } from 'src/app/_enums/status.enum';
import { Gender } from 'src/app/_enums/gender.enum';

@Injectable({
  providedIn: 'root'
})
export class Api implements ApiInterface {

  constructor(
    private angularFirestore: AngularFirestore
  ) {}

  /** mock data */

  private userAuthorityStatuses$ = new BehaviorSubject<UserAuthorityStatus[]>([
    { uuid: 'e90866a2-91a8-5480-bc02-67f88277e5f8', password: '7f15fa00-23ef-5e5c-9365-50de9d7e1ca5', online: false },
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
      profile: 'e90946a4-94a8-5440-bc02-64f88277e5a1',
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

  private streams = new Map<string, () => void>();

  private getCollection = <T>(collectionName: string): AngularFirestoreCollection<T> => {
    const propertyName = collectionName + 'Collection';
    if (!this[propertyName]) {
      this[propertyName] = this.angularFirestore.collection<T>(environment.FIRESTORE_ROOT + collectionName);
    }
    return this[propertyName];
  }

  private debugMessage = (message: string) => {
    if (!environment.production) {
      console.log('api', message);
    }
  }

  unsubscribeStream = (key: string) => {
    this.streams.get(key)();
    this.streams.delete(key);
  }

  unsubscribeStreams = () => {
    this.streams.forEach(stream => stream());
  }

  /** authority */
  login = (uuid: string, password: string) => {
    this.debugMessage('login');
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
    this.debugMessage('readUserPrimarykeys');

    const userPrimarykeys$ = new Subject<DocumentSnapshot<any>>();
    this.streams.set(
      'userPrimarykeys',
      this.getCollection<any>('primarykeys').doc('user-primarykeys').ref.onSnapshot(userPrimarykeys$)
    );

    return userPrimarykeys$.pipe(
      filter(snapshot => !snapshot.metadata.fromCache),
      map(snapshot => Object.values<UserPrimarykey>(snapshot.data()))
    );
  }

  createUserPrimarykey = (userPrimarykey: UserPrimarykey) => {
    this.debugMessage('createUserPrimarykey');

    userPrimarykey.uuid = uuidv5(new Date().toString(), environment.UUID_NAMESPACE);
    const doc = {};
    doc[userPrimarykey.uuid] = userPrimarykey;

    return this.getCollection<any>('primarykeys')
      .doc('user-primarykeys')
      .update(doc)
      .then(() => userPrimarykey.uuid);
  }

  updateUserPrimarykey = (userPrimarykey: UserPrimarykey) => {
    this.debugMessage('updateUserPrimarykey');

    const doc = {};
    doc[userPrimarykey.uuid] = userPrimarykey;

    return this.getCollection<any>('primarykeys')
      .doc('user-primarykeys')
      .update(doc)
      .then(() => Status.SUCCESS)
      .catch(() => Status.NOT_EXIST);
  }

  deleteUserPrimarykey = (uuid: string) => {
    this.debugMessage('deleteUserPrimarykey');

    const doc = {};
    doc[uuid] = firebase.default.firestore.FieldValue.delete();

    return this.getCollection<any>('primarykeys')
      .doc('user-primarykeys')
      .update(doc)
      .then(() => Status.SUCCESS)
      .catch(() => Status.NOT_EXIST);
  }

  readUser = (uuid: string) => {
    this.debugMessage('readUser');

    const user$ = new Subject<firebase.default.firestore.DocumentSnapshot<User>>();
    this.streams.set(
      uuid,
      this.getCollection<User>('users').doc(uuid).ref.onSnapshot(user$)
    );

    return user$.pipe(
      filter(snapshot => !snapshot.metadata.fromCache),
      map(snapshot => snapshot.data())
    );
  }

  createUser = (user: User) => {
    this.debugMessage('createUser');

    return this.getCollection<User>('users')
      .doc(user.uuid)
      .set(user)
      .then(() => Status.SUCCESS);
  }

  updateUser = (user: User) => {
    this.debugMessage('updateUser');

    return this.getCollection<User>('users')
      .doc(user.uuid)
      .update(user)
      .then(() => Status.SUCCESS)
      .catch(() => Status.NOT_EXIST);
  }

  deleteUser = (uuid: string) => {
    this.debugMessage('deleteUser');

    return this.getCollection<User>('users')
      .doc(uuid)
      .delete()
      .then(() => Status.SUCCESS)
      .catch(() => Status.NOT_EXIST);
  }

  /** congregations */

  readCongregations = () => {
    this.debugMessage('readCongregations');

    const congregations$ = new Subject<QuerySnapshot<Congregation>>();
    this.streams.set(
      'congregations',
      this.getCollection<Congregation>('congregations').ref.onSnapshot(congregations$)
    );

    return congregations$.pipe(
      filter(snapshot => !snapshot.metadata.fromCache),
      map(snapshot => snapshot.docs.map(doc => doc.data())),
      map((congregations) => congregations.sort((a, b) => a.order - b.order))
    );
  }

  updateCongregations = (congregations: Congregation[]) => {
    this.debugMessage('updateCongregations');

    const collection = this.getCollection<Congregation>('congregations');
    const batch = this.angularFirestore.firestore.batch();

    congregations.forEach((congregation, index) => {
      congregation.order = index;
      batch.update(collection.doc(congregation.uuid).ref, congregation);
    });

    return batch.commit().then(() => Status.SUCCESS);
  }

  createCongregation = (congregation: Congregation) => {
    this.debugMessage('createCongregation');

    congregation.uuid = uuidv5(new Date().toString(), environment.UUID_NAMESPACE);

    return this.getCollection<Congregation>('congregations')
      .doc(congregation.uuid)
      .set(congregation)
      .then(() => congregation.uuid);
  }

  updateCongregation = (congregation: Congregation) => {
    this.debugMessage('updateCongregation');

    return this.getCollection<Congregation>('congregations')
      .doc(congregation.uuid)
      .update(congregation)
      .then(() => Status.SUCCESS)
      .catch(() => Status.NOT_EXIST);
  }

  deleteCongregation = (uuid: string) => {
    this.debugMessage('deleteCongregation');

    return this.getCollection<Congregation>('congregations')
      .doc(uuid)
      .delete()
      .then(() => Status.SUCCESS)
      .catch(() => Status.NOT_EXIST);
  }

  /** tags */

  readTags = () => {
    this.debugMessage('readTags');

    const tags$ = new Subject<QuerySnapshot<Tag>>();
    this.streams.set(
      'tags',
      this.getCollection<Tag>('tags').ref.onSnapshot(tags$)
    );

    return tags$.pipe(
      filter(snapshot => !snapshot.metadata.fromCache),
      map(snapshot => snapshot.docs.map(doc => doc.data())),
      map((tags) => tags.sort((a, b) => a.order - b.order))
    );
  }

  updateTags = (tags: Tag[]) => {
    this.debugMessage('updateTags');

    const collection = this.getCollection<Tag>('tags');
    const batch = this.angularFirestore.firestore.batch();

    tags.forEach((tag, index) => {
      tag.order = index;
      batch.update(collection.doc(tag.uuid).ref, tag);
    });

    return batch.commit().then(() => Status.SUCCESS);
  }

  createTag = (tag: Tag) => {
    this.debugMessage('createTag');

    tag.uuid = uuidv5(new Date().toString(), environment.UUID_NAMESPACE);

    return this.getCollection<Tag>('tags')
      .doc(tag.uuid)
      .set(tag)
      .then(() => tag.uuid);
  }

  updateTag = (tag: Tag) => {
    this.debugMessage('updateTag');

    return this.getCollection<Tag>('tags')
      .doc(tag.uuid)
      .update(tag)
      .then(() => Status.SUCCESS)
      .catch(() => Status.NOT_EXIST);
  }

  deleteTag = (uuid: string) => {
    this.debugMessage('deleteTag');

    return this.getCollection<Tag>('tags')
      .doc(uuid)
      .delete()
      .then(() => Status.SUCCESS)
      .catch(() => Status.NOT_EXIST);
  }

  /** profile primary key */

  readProfilePrimarykeys = () => {
    this.debugMessage('readProfilePrimarykeys');

    const profilePrimarykeys$ = new Subject<DocumentSnapshot<any>>();
    this.streams.set(
      'profilePrimarykeys',
      this.getCollection<any>('primarykeys').doc('profile-primarykeys').ref.onSnapshot(profilePrimarykeys$)
    );

    return profilePrimarykeys$.pipe(
      filter(snapshot => !snapshot.metadata.fromCache),
      map(snapshot => Object.values<ProfilePrimarykey>(snapshot.data())),
      map(profilePrimarykeys => profilePrimarykeys.sort((a, b) => a.order - b.order))
    );
  }

  updateProfilePrimarykeys = (profilePrimarykeys: ProfilePrimarykey[]) => {
    this.debugMessage('updateProfilePrimarykeys');

    const doc = {};
    profilePrimarykeys.forEach((profilePrimarykey, index) => {
      profilePrimarykey.order = index;
      doc[profilePrimarykey.uuid] = profilePrimarykey;
    });

    return this.getCollection<any>('primarykeys')
      .doc('profile-primarykeys')
      .update(doc)
      .then(() => Status.SUCCESS);
  }

  createProfilePrimarykey = (profilePrimarykey: ProfilePrimarykey) => {
    this.debugMessage('createProfilePrimarykey');

    profilePrimarykey.uuid = uuidv5(new Date().toString(), environment.UUID_NAMESPACE);
    const doc = {};
    doc[profilePrimarykey.uuid] = profilePrimarykey;

    return this.getCollection<any>('primarykeys')
      .doc('profile-primarykeys')
      .update(doc)
      .then(() => profilePrimarykey.uuid);
  }

  updateProfilePrimarykey = (profilePrimarykey: ProfilePrimarykey) => {
    this.debugMessage('updateProfilePrimarykey');

    const doc = {};
    doc[profilePrimarykey.uuid] = profilePrimarykey;

    return this.getCollection<any>('primarykeys')
      .doc('profile-primarykeys')
      .update(doc)
      .then(() => Status.SUCCESS)
      .catch(() => Status.NOT_EXIST);
  }

  deleteProfilePrimarykey = (uuid: string) => {
    this.debugMessage('deleteProfilePrimarykey');

    const doc = {};
    doc[uuid] = firebase.default.firestore.FieldValue.delete();

    return this.getCollection<any>('primarykeys')
      .doc('profile-primarykeys')
      .update(doc)
      .then(() => Status.SUCCESS)
      .catch(() => Status.NOT_EXIST);
  }

  /** profile */

  readProfile = (uuid: string) => {
    this.debugMessage('readProfile');

    const profile$ = new Subject<firebase.default.firestore.DocumentSnapshot<Profile>>();
    this.streams.set(
      uuid,
      this.getCollection<Profile>('profiles').doc(uuid).ref.onSnapshot(profile$)
    );

    return profile$.pipe(
      filter(snapshot => !snapshot.metadata.fromCache),
      map(snapshot => snapshot.data())
    );
  }

  createProfile = (profile: Profile) => {
    this.debugMessage('createProfile');

    return this.getCollection<Profile>('profiles')
      .doc(profile.uuid)
      .set(profile)
      .then(() => Status.SUCCESS);
  }

  updateProfile = (profile: Profile) => {
    this.debugMessage('updateProfile');

    return this.getCollection<Profile>('profiles')
      .doc(profile.uuid)
      .update(profile)
      .then(() => Status.SUCCESS)
      .catch(() => Status.NOT_EXIST);
  }

  deleteProfile = (uuid: string) => {
    this.debugMessage('deleteProfile');

    return this.getCollection<Profile>('profiles')
      .doc(uuid)
      .delete()
      .then(() => Status.SUCCESS)
      .catch(() => Status.NOT_EXIST);
  }
}
