import { Injectable } from '@angular/core';
import { ApiInterface } from 'src/app/_api/api.interface';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';
import { EXISTED_ERROR } from '../_classes/errors/EXISTED_ERROR';
import { Congregation } from '../_interfaces/congregation.interface';
import { PersonalShifts } from '../_interfaces/personal-shifts.interface';
import { ShiftHours } from '../_interfaces/shift-hours.interface';
import { Shift } from '../_interfaces/shift.interface';
import { Site } from '../_interfaces/site.interface';
import { Statistic } from '../_interfaces/statistic.interface';
import { User, UserKey } from '../_interfaces/user.interface';
import { docExists as isDocExists, docsExists } from './firebase-helper';
import { SiteShifts } from '../_interfaces/site-shifts.interface';
import { UserSchedule } from '../_interfaces/user-schedule.interface';

@Injectable({
  providedIn: 'root',
})
export class Api implements ApiInterface {
  private readonly mailSuffix = '@mail.tpw';

  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth
  ) {}

  login = (uuid: string, password: string): Promise<void> => {
    const email = [uuid, this.mailSuffix].join('');
    const pass = uuidv5(password, environment.UUID_NAMESPACE);
    return this.angularFireAuth
      .signInWithEmailAndPassword(email, pass)
      .then(() => {
        return;
      });
  };

  logout = (): Promise<void> => {
    return this.angularFireAuth.signOut();
  };

  readUserKeys = (): Promise<UserKey[]> => {
    return firstValueFrom(
      this.angularFirestore.collection<UserKey>('UserKeys').get()
    ).then((query) => {
      if (query.docs.length > 0) {
        return query.docs.map((doc) => doc.data());
      } else {
        return Promise.reject('NOT_EXIST');
      }
    });
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

  createUser = async (user: Omit<User, 'uuid' | 'activate'>) => {
    const userNameExists = await docsExists(
      this.angularFirestore.collection<UserKey>('UserKeys', (query) =>
        query.where('username', '==', user.username)
      )
    );
    if (userNameExists) throw new EXISTED_ERROR('username');

    // ensure non-duplicated uuid
    let uuid: string;
    do {
      uuid = uuidv4();
    } while (
      await isDocExists(this.angularFirestore.doc<UserKey>(`UserKeys/${uuid}`))
    );

    await Promise.all([
      this.angularFirestore.doc<User>(`Users/${uuid}`).set({
        ...user,
        uuid,
        activate: true,
      }),
      this.angularFirestore.doc<UserKey>(`UserKeys/${uuid}`).set({
        uuid,
        activate: true,
        username: user.username,
      }),
      this.angularFirestore
        .doc<UserSchedule>(`Users/${uuid}/Schedule/config`)
        .set(this.#EMPTY_USER_SCHEDULE),
    ]);

    await this.angularFireAuth.createUserWithEmailAndPassword(
      uuid + this.mailSuffix,
      uuidv5(user.baptizeDate.replace(/-/g, ''), environment.UUID_NAMESPACE)
    );

    return uuid;
  };

  patchUser = async (user: Omit<User, 'activate'>) => {
    const updates = [
      this.angularFirestore.doc<User>(`Users/${user.uuid}`).update(user),
    ];
    if (user.username) {
      updates.push(
        this.angularFirestore
          .doc<UserKey>(`UserKeys/${user.uuid}`)
          .update({ username: user.username })
      );
    }
    await Promise.all(updates);
  };

  updateUserActivation = async (uuid: string, activate: boolean) => {
    const db = this.angularFirestore;
    if (!activate) {
      const userShifts = await fetchFutureShifts();
      if (userShifts.length) return userShifts;
    }

    writeDatabase();
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
          db.collection<ShiftHours>('ShiftHours').ref.get(),
        ])
      ).map((snapshot) => snapshot.docs.map((doc) => doc.data())) as [
        Site[],
        ShiftHours[]
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
      return Promise.all([
        db.doc<UserKey>(`UserKeys/${uuid}`).update({ activate }),
        db.doc<User>(`Users/${uuid}`).update({ activate }),
        db
          .doc<UserSchedule>(`Users/${uuid}/Schedule/config`)
          .update({ assign: activate }),
      ]);
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
    cong: Omit<Congregation, 'uuid' | 'activate'>
  ): Promise<Congregation> => {
    let uuid: string = uuidv4();
    await Promise.all([
      this.angularFirestore.doc<Congregation>(`Congregations/${uuid}`).set({
        ...cong,
        uuid,
        activate: true,
      }),
    ]);
    return {...cong,uuid,activate: true}
  };

  changeCongregationActivation = async (
    cong: Congregation
  ): Promise<boolean> => {
    await Promise.all([
      this.angularFirestore.doc<ShiftHours>(`Congregations/${cong.uuid}`).update({
        activate: !cong.activate,
      }),
    ]);
    return !cong.activate
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

  createSites = async (
    site: Omit<Site, 'uuid' | 'activate'>
  ): Promise<Site> => {
    let uuid: string = uuidv4();
    await Promise.all([
      this.angularFirestore.doc<Site>(`Sites/${uuid}`).set({
        ...site,
        uuid,
        activate: true,
      }),
    ]);
    return {...site,uuid,activate: true}
  };

  changeSiteActivation = async (
    site: Site
  ): Promise<boolean> => {
    await Promise.all([
      this.angularFirestore.doc<Site>(`Sites/${site.uuid}`).update({
        activate: !site.activate,
      }),
    ]);
    return !site.activate
  };

  changeShiftHourDelivery = async (
    shifthour: ShiftHours
  ): Promise<boolean> => {
    await Promise.all([
      this.angularFirestore.doc<ShiftHours>(`ShiftHours/${shifthour.uuid}`).update({
        deliver: !shifthour.deliver,
      }),
    ]);
    return !shifthour.deliver
  };

  readShiftHoursList = (): Promise<ShiftHours[]> => {
    return firstValueFrom(
      this.angularFirestore.collection<ShiftHours>('ShiftHours').get()
    ).then((query) => {
      if (query.docs.length > 0) {
        return query.docs.map((doc) => doc.data());
      } else {
        return Promise.reject('NOT_EXIST');
      }
    });
  };

  createShiftHours = async (
    shifthours: Omit<ShiftHours, 'uuid' | 'activate'>
  ): Promise<ShiftHours> => {
    let uuid: string = uuidv4();
    await Promise.all([
      this.angularFirestore.doc<ShiftHours>(`ShiftHours/${uuid}`).set({
        ...shifthours,
        uuid,
        activate: true,
      }),
    ]);
    return {...shifthours,uuid,activate: true}
  };

  changeShiftHourActivation = async (
    shifthour: ShiftHours
  ): Promise<boolean> => {
    await Promise.all([
      this.angularFirestore.doc<ShiftHours>(`ShiftHours/${shifthour.uuid}`).update({
        activate: !shifthour.activate,
      }),
    ]);
    return !shifthour.activate
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
}
