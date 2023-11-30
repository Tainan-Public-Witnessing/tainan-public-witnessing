import { Injectable } from '@angular/core';
import { ApiInterface } from 'src/app/_api/api.interface';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { arrayUnion, deleteField } from 'firebase/firestore';

import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';
import { EXISTED_ERROR } from '../_classes/errors/EXISTED_ERROR';
import { docsExists } from '../_helpers/firebase-helper';
import { Congregation } from '../_interfaces/congregation.interface';
import { PersonalShifts } from '../_interfaces/personal-shifts.interface';
import { Settings } from '../_interfaces/settings.interface';
import { ShiftHour } from '../_interfaces/shift-hours.interface';
import { Shift } from '../_interfaces/shift.interface';
import { SiteShifts } from '../_interfaces/site-shifts.interface';
import { Site } from '../_interfaces/site.interface';
import { Statistic } from '../_interfaces/statistic.interface';
import { UserSchedule } from '../_interfaces/user-schedule.interface';
import { User, UserKey } from '../_interfaces/user.interface';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class Api implements ApiInterface {
  private readonly mailSuffix = '@mail.tpw';

  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth
  ) {}

  login = async (uuid: string, password: string): Promise<void> => {
    const email = [uuid, this.mailSuffix].join('');
    const pass = uuidv5(password, environment.UUID_NAMESPACE);
    await this.angularFireAuth.signInWithEmailAndPassword(email, pass);
  };

  logout = (): Promise<void> => {
    return this.angularFireAuth.signOut();
  };

  readUserKeys = async (): Promise<UserKey[]> => {
    const snapshot = await this.angularFirestore
      .doc<Settings>('/Settings/settings')
      .ref.get();
    return snapshot.data()!.userKeys;
  };

  readAllUsers = async (): Promise<User[]> => {
    const snapshots = await firstValueFrom(
      this.angularFirestore.collection<User>('/Users').get()
    );

    return snapshots.docs.map((snapshot) => snapshot.data());
  };

  readUser = (uuid: string): Promise<User> => {
    return this.angularFirestore
      .collection<User>('Users')
      .doc<User>(uuid)
      .ref.get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data() as User;
        } else {
          return Promise.reject('NOT_EXIST');
        }
      });
  };

  createUser = (user: Omit<User, 'uuid' | 'activate' | 'bindCode'>) => {
    return this.angularFirestore.firestore.runTransaction(async (trans) => {
      const userNameExists = await docsExists(
        this.angularFirestore.collection<User>('/Users', (query) =>
          query.where('username', '==', user.username)
        )
      );
      if (userNameExists) throw new EXISTED_ERROR('username');

      // ensure non-duplicated uuid
      let uuid: string;
      do {
        uuid = uuidv4();
      } while (
        (await trans.get(this.angularFirestore.doc<User>(`/Users/${uuid}`).ref))
          .exists
      );

      trans.set(this.angularFirestore.doc<User>(`Users/${uuid}`).ref, {
        ...user,
        uuid,
        activate: true,
        bindCode: Math.floor(Math.random() * 9999_9999)
          .toString()
          .padStart(8, '0'),
      });
      trans.set(
        this.angularFirestore.doc<UserSchedule>(`Users/${uuid}/Schedule/config`)
          .ref,
        this.#EMPTY_USER_SCHEDULE
      );
      trans.update(
        this.angularFirestore.doc<Settings>(`/Settings/settings`).ref,
        {
          userKeys: arrayUnion({
            uuid,
            activate: true,
            username: user.username,
          }),
        }
      );
      return uuid;
    });
  };

  patchUser = (user: Omit<User, 'activate' | 'bindCode'>) => {
    return this.angularFirestore.firestore.runTransaction(async (trans) => {
      if (!!user.username) {
        const settingsRef =
          this.angularFirestore.doc<Settings>('/Settings/settings').ref;
        const { userKeys } = (await trans.get(settingsRef)).data()!;
        userKeys.find((u) => u.uuid === user.uuid)!.username = user.username;
        trans.update(settingsRef, { userKeys });

        trans.update(
          this.angularFirestore.doc<User>(`/Users/${user.uuid}`).ref,
          user
        );
      }
    });
  };

  updateUserActivation = async (uuid: string, activate: boolean) => {
    const db = this.angularFirestore;
    if (!activate) {
      const userShifts = await fetchFutureShifts();
      if (userShifts.length) return userShifts;
    }

    await writeDatabase();
    return [];

    async function fetchFutureShifts() {
      let userShifts: Shift[] = [];
      let monthBeingChecked = new Date();

      while (true) {
        const currentYm = monthBeingChecked.toJSON().slice(0, 7);
        monthBeingChecked.setMonth(monthBeingChecked.getMonth() + 1);

        const userMontlyShifts = await fetchMontlyShift(currentYm);
        if (!userMontlyShifts) break;

        userShifts = userShifts.concat(userMontlyShifts);
      }

      if (userShifts.length === 0) return [];

      const [sites, shiftHours] = (
        await Promise.all([
          db.collection<Site>('Sites').ref.get(),
          db.collection<ShiftHour>('ShiftHours').ref.get(),
        ])
      ).map((snapshot) => snapshot.docs.map((doc) => doc.data())) as [
        Site[],
        ShiftHour[]
      ];

      return userShifts
        .map((shift) => ({
          date: shift.date,
          hour: shiftHours.find((hour) => hour.uuid === shift.shiftHoursUuid)!,
          site: sites.find((site) => site.uuid === shift.siteUuid)!,
        }))
        .filter(
          (shift) =>
            new Date(`${shift.date}T${shift.hour.startTime}:00.000`) >
            new Date()
        );
    }

    async function fetchMontlyShift(ym: string) {
      const allShifts = db.doc(`/MonthlyData/${ym}`).collection('Shifts');
      if (!(await docsExists(allShifts))) return undefined;

      const userShifts = await db
        .doc<PersonalShifts>(`MonthlyData/${ym}/PersonalShifts/${uuid}`)
        .ref.get();

      if (!userShifts.exists) return [];

      const { shiftUuids } = userShifts.data()!;
      if (!Array.isArray(shiftUuids) || shiftUuids.length === 0) return [];

      return await Promise.all(
        shiftUuids.map(
          async (shiftUuid) =>
            (
              await db
                .doc<Shift>(`/MonthlyData/${ym}/Shifts/${shiftUuid}`)
                .ref.get()
            ).data()!
        )
      );
    }

    function writeDatabase() {
      return db.firestore.runTransaction(async (trans) => {
        const settingsRef = db.doc<Settings>('/Settings/settings').ref;
        const { userKeys } = (await trans.get(settingsRef)).data()!;
        userKeys.find((u) => u.uuid === uuid)!.activate = activate;
        trans.update(settingsRef, { userKeys });
        trans.update(db.doc<User>(`Users/${uuid}`).ref, {
          activate,
          expireAt: activate ? deleteField() : moment().add(2, 'year').toDate(),
        });
      });
    }
  };

  readCongregations = (): Promise<Congregation[]> => {
    return firstValueFrom(
      this.angularFirestore.collection<Congregation>('Congregations').get()
    ).then((query) => {
      if (query.docs.length > 0) {
        return query.docs.map((doc) => doc.data());
      } else {
        return Promise.reject('NOT_EXIST');
      }
    });
  };

  createCongregation = async (
    cong: Omit<Congregation, 'uuid' | 'activate' | 'order'>
  ): Promise<void> => {
    let uuid: string = uuidv4();
    let maxOrder = await firstValueFrom(
      this.angularFirestore.collection<Congregation>('Congregations').get()
    ).then((query) => Math.max(...query.docs.map((m) => m.data().order)));

    await Promise.all([
      this.angularFirestore.doc<Congregation>(`Congregations/${uuid}`).set({
        ...cong,
        uuid,
        order: maxOrder + 1,
        activate: true,
      }),
    ]);
  };

  updateCongregation = async (
    cong: Omit<Congregation, 'activate' | 'order'>
  ): Promise<void> => {
    const { uuid, name } = cong;
    await Promise.all([
      this.angularFirestore.doc<Congregation>(`Congregations/${uuid}`).update({
        name: name,
      }),
    ]);
  };

  changeCongregationActivation = async (cong: Congregation): Promise<void> => {
    await Promise.all([
      this.angularFirestore
        .doc<ShiftHour>(`Congregations/${cong.uuid}`)
        .update({
          activate: !cong.activate,
        }),
    ]);
  };

  readSites = (): Promise<Site[]> => {
    return firstValueFrom(
      this.angularFirestore.collection<Site>('Sites').get()
    ).then((query) => {
      if (query.docs.length > 0) {
        return query.docs.map((doc) => doc.data());
      } else {
        return Promise.reject('NOT_EXIST');
      }
    });
  };

  createSite = async (
    site: Omit<Site, 'uuid' | 'activate' | 'order'>
  ): Promise<void> => {
    let uuid: string = uuidv4();
    let maxOrder = await firstValueFrom(
      this.angularFirestore.collection<Site>('Sites').get()
    ).then((query) => Math.max(...query.docs.map((m) => m.data().order)));

    await Promise.all([
      this.angularFirestore.doc<Site>(`Sites/${uuid}`).set({
        ...site,
        uuid,
        order: maxOrder + 1,
        activate: true,
      }),
    ]);
  };

  updateSite = async (
    site: Omit<Site, 'activate' | 'order'>
  ): Promise<void> => {
    const { uuid, position, name } = site;
    await Promise.all([
      this.angularFirestore.doc<Site>(`Sites/${uuid}`).update({
        name: name,
        position: position,
      }),
    ]);
  };

  changeSiteActivation = async (site: Site): Promise<void> => {
    await Promise.all([
      this.angularFirestore.doc<Site>(`Sites/${site.uuid}`).update({
        activate: !site.activate,
      }),
    ]);
  };

  changeShiftHourDelivery = async (shifthour: ShiftHour): Promise<void> => {
    await Promise.all([
      this.angularFirestore
        .doc<ShiftHour>(`ShiftHours/${shifthour.uuid}`)
        .update({
          deliver: !shifthour.deliver,
        }),
    ]);
  };

  readShiftHours = (): Promise<ShiftHour[]> => {
    return firstValueFrom(
      this.angularFirestore.collection<ShiftHour>('ShiftHours').get()
    ).then((query) => {
      if (query.docs.length > 0) {
        return query.docs.map((doc) => doc.data());
      } else {
        return Promise.reject('NOT_EXIST');
      }
    });
  };

  createShiftHour = async (
    shifthours: Omit<ShiftHour, 'uuid' | 'activate' | 'deliver'>
  ): Promise<void> => {
    let uuid: string = uuidv4();
    await Promise.all([
      this.angularFirestore.doc<ShiftHour>(`ShiftHours/${uuid}`).set({
        ...shifthours,
        uuid,
        activate: true,
        deliver: false,
      }),
    ]);
  };
  updateShiftHour = async (
    shiftHour: Omit<ShiftHour, 'activate' | 'deliver'>
  ): Promise<void> => {
    const { uuid, name, startTime, endTime } = shiftHour;
    await Promise.all([
      this.angularFirestore.doc<ShiftHour>(`ShiftHours/${uuid}`).update({
        name,
        startTime,
        endTime,
      }),
    ]);
  };

  changeShiftHourActivation = async (shiftHour: ShiftHour): Promise<void> => {
    await Promise.all([
      this.angularFirestore
        .doc<ShiftHour>(`ShiftHours/${shiftHour.uuid}`)
        .update({
          activate: !shiftHour.activate,
        }),
    ]);
  };

  readShiftsByMonth = (yearMonth: string): Promise<Shift[]> => {
    return firstValueFrom(
      this.angularFirestore
        .collection<Shift>(['MonthlyData', yearMonth, 'Shifts'].join('/'))
        .get()
    ).then((query) => {
      if (query.docs.length > 0) {
        return query.docs.map((doc) => doc.data());
      } else {
        return Promise.reject('NOT_EXIST');
      }
    });
  };

  readShiftsByDate = (date: string): Promise<Shift[]> => {
    const yearMonth = date.slice(0, 7);
    return firstValueFrom(
      this.angularFirestore
        .collection<Shift>(
          ['MonthlyData', yearMonth, 'Shifts'].join('/'),
          (document) => document.where('date', '==', date)
        )
        .get()
    ).then((query) => {
      if (query.docs.length > 0) {
        return query.docs.map((doc) => doc.data());
      } else {
        return Promise.reject('NOT_EXIST');
      }
    });
  };

  readShifts = (yearMonth: string, uuids: string[]): Promise<Shift[]> => {
    const setNumber = Math.ceil(uuids.length / 10);
    const uuidSets = [];
    for (let i = 0; i < setNumber; i++) {
      uuidSets.push(uuids.slice(i * 10, i * 10 + 10));
    }
    return Promise.all(
      uuidSets.map((_uuids) => {
        return firstValueFrom(
          this.angularFirestore
            .collection<Shift>(
              ['MonthlyData', yearMonth, 'Shifts'].join('/'),
              (document) => document.where('uuid', 'in', _uuids)
            )
            .get()
        );
      })
    ).then((querys) => {
      let _shifts: Shift[] = [];
      querys
        .map((query) => query.docs.map((doc) => doc.data()))
        .forEach((_shiftSet) => (_shifts = _shifts.concat(_shiftSet)));
      if (_shifts.length > 0) {
        return _shifts;
      } else {
        return Promise.reject('NOT_EXIST');
      }
    });
  };

  readShift = (yearMonth: string, uuid: string): Promise<Shift> => {
    return firstValueFrom(
      this.angularFirestore
        .collection<Shift>(
          ['MonthlyData', yearMonth, 'Shifts'].join('/'),
          (document) => document.where('uuid', '==', uuid)
        )
        .get()
    ).then((query) => {
      if (query.docs.length > 0) {
        return query.docs.map((doc) => doc.data())[0];
      } else {
        return Promise.reject('NOT_EXIST');
      }
    });
  };

  updateShift = (shift: Shift): Promise<void> => {
    const yearMonth = shift.date.slice(0, 7);
    return this.angularFirestore
      .doc<Shift>(['MonthlyData', yearMonth, 'Shifts', shift.uuid].join('/'))
      .update(shift);
  };

  createShift = (shift: Shift): Promise<void> => {
    const yearMonth = shift.date.slice(0, 7);
    return this.angularFirestore
      .doc<Shift>(['MonthlyData', yearMonth, 'Shifts', shift.uuid].join('/'))
      .set(shift);
  };

  deleteShift = async (shift: Shift): Promise<void> => {
    const yearMonth = shift.date.slice(0, 7);
    let crewUuids = await firstValueFrom(
      this.angularFirestore
        .collection<Shift>(
          ['MonthlyData', yearMonth, 'Shifts'].join('/'),
          (doc) => doc.where('uuid', '==', shift.uuid)
        )
        .get()
    ).then((doc) => doc.docs.map((d) => d.data())[0].crewUuids);
    for (let crewUuid of crewUuids) {
      let personalShift = await firstValueFrom(
        this.angularFirestore
          .collection<PersonalShifts>(
            ['MonthlyData', yearMonth, 'PersonalShifts'].join('/'),
            (doc) => doc.where('uuid', '==', crewUuid)
          )
          .get()
      ).then((doc) => doc.docs.map((d) => d.data())[0]);
      personalShift.shiftUuids = personalShift.shiftUuids.filter(
        (f) => f !== shift.uuid
      );
      await this.angularFirestore
        .doc<PersonalShifts>(
          `MonthlyData/${yearMonth}/PersonalShifts/${crewUuid}`
        )
        .update(personalShift);
      await this.angularFirestore
        .doc(`/MonthlyData/${yearMonth}/Shifts/${shift.uuid}`)
        .delete();
    }
  };

  readPersonalShifts = (
    yearMonth: string,
    uuid: string
  ): Promise<PersonalShifts> => {
    return firstValueFrom(
      this.angularFirestore
        .collection<PersonalShifts>(
          ['MonthlyData', yearMonth, 'PersonalShifts'].join('/'),
          (document) => document.where('uuid', '==', uuid)
        )
        .get()
    ).then((query) => {
      if (query.docs.length > 0) {
        return query.docs.map((doc) => doc.data())[0];
      } else {
        return Promise.reject('NOT_EXIST');
      }
    });
  };

  createPersonalShifts = (
    yearMonth: string,
    personalShift: PersonalShifts
  ): Promise<void> => {
    return this.angularFirestore
      .doc<PersonalShifts>(
        ['MonthlyData', yearMonth, 'PersonalShifts', personalShift.uuid].join(
          '/'
        )
      )
      .set(personalShift);
  };

  updatePersonalShifts = (
    yearMonth: string,
    personalShift: PersonalShifts
  ): Promise<void> => {
    return this.angularFirestore
      .doc<PersonalShifts>(
        ['MonthlyData', yearMonth, 'PersonalShifts', personalShift.uuid].join(
          '/'
        )
      )
      .update(personalShift);
  };

  readStatistic = (yearMonth: string, uuid: string): Promise<Statistic> => {
    return firstValueFrom(
      this.angularFirestore
        .doc<Statistic>(
          ['MonthlyData', yearMonth, 'Statistics', uuid].join('/')
        )
        .get()
    ).then((doc) => {
      const _statistic = doc.data();
      if (_statistic) {
        return _statistic;
      } else {
        return Promise.reject();
      }
    });
  };

  createStatistic = (statistic: Statistic): Promise<void> => {
    const yearMonth = statistic.date.slice(0, 7);
    return this.angularFirestore
      .doc<Statistic>(
        ['MonthlyData', yearMonth, 'Statistics', statistic.uuid].join('/')
      )
      .set(statistic);
  };

  updateStatistic = (statistic: Statistic): Promise<void> => {
    const yearMonth = statistic.date.slice(0, 7);
    return this.angularFirestore
      .doc<Statistic>(
        ['MonthlyData', yearMonth, 'Statistics', statistic.uuid].join('/')
      )
      .update(statistic);
  };

  readSiteShifts = async () => {
    const snapshots = await this.angularFirestore
      .collection<SiteShifts>('SiteShifts')
      .ref.get();
    return snapshots.docs.map((snapshot) => snapshot.data());
  };

  createSiteShifts = async (
    siteShifts: Omit<
      SiteShifts,
      'uuid' | 'activate' | 'attendance' | 'delivers'
    >[]
  ) => {
    const batch = this.angularFirestore.firestore.batch();
    const collection =
      this.angularFirestore.collection<SiteShifts>('SiteShifts');
    siteShifts.forEach((siteShift) => {
      let uuid: string = uuidv4();
      const docRef = collection.doc(uuid).ref;
      batch.set(docRef, {
        ...siteShift,
        uuid,
        activate: false,
        attendance: 0,
        delivers: 0,
      });
    });
    await batch.commit();
  };

  updateSiteShift = async (siteShift: SiteShifts): Promise<void> => {
    const { uuid } = siteShift;
    await this.angularFirestore
      .doc<SiteShifts>(`SiteShifts/${uuid}`)
      .update(siteShift);
  };

  readonly #EMPTY_USER_SCHEDULE: UserSchedule = {
    availableHours: {},
    unavailableDates: [],
    partnerUuid: '',
    assign: true,
  };

  readUserSchedule = async (userUuid: string) => {
    const snapshot = await this.angularFirestore
      .doc<UserSchedule>(`Users/${userUuid}/Schedule/config`)
      .ref.get();

    return snapshot.data() || this.#EMPTY_USER_SCHEDULE;
  };
  patchUserSchedule = async (userUuid: string, data: Partial<UserSchedule>) => {
    await this.angularFirestore
      .doc(`Users/${userUuid}/Schedule/config`)
      .update(data);
  };
  cancelLineToken = async (userUuid: string) => {
    await this.angularFirestore
      .doc(`Users/${userUuid}/Schedule/config`)
      .update({ lineToken: '' });
  };
}
