import { Injectable } from '@angular/core';
import { ApiInterface } from 'src/app/_api/api.interface';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { Congregation } from '../_interfaces/congregation.interface';
import { PersonalShifts } from '../_interfaces/personal-shifts.interface';
import { ShiftHours } from '../_interfaces/shift-hours.interface';
import { Shift } from '../_interfaces/shift.interface';
import { Site } from '../_interfaces/site.interface';
import { UserKey, User } from '../_interfaces/user.interface';
import { firstValueFrom } from 'rxjs';
import { v5 as uuidv5 } from 'uuid';
import { environment } from 'src/environments/environment';
import { Statistic } from '../_interfaces/statistic.interface';

@Injectable({
  providedIn: 'root'
})
export class Api implements ApiInterface {

  private readonly mailSurfix = '@mail.tpw';

  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
  ) {}

  login = (uuid: string, password: string): Promise<void> => {
    const email = [uuid, this.mailSurfix].join('')
    const pass = uuidv5(password, environment.UUID_NAMESPACE);
    return this.angularFireAuth.signInWithEmailAndPassword(email, pass).then(() => {
      return;
    });
  };

  logout = (): Promise<void> => {
    return this.angularFireAuth.signOut();
  };

  readUserKeys = (): Promise<UserKey[]> => {
    return firstValueFrom(this.angularFirestore.collection<UserKey>('UserKeys').get()).then(query => {
      if (query.docs.length > 0) {
        return query.docs.map(doc => doc.data());
      } else {
        return Promise.reject('NOT_EXIST');
      }
    });
  };

  readUser = (uuid: string): Promise<User> => {
    return this.angularFirestore.collection<User>('Users').doc<User>(uuid).ref.get().then(doc => {
      if (doc.exists) {
        return doc.data() as User;
      } else {
        return Promise.reject('NOT_EXIST');
      }
    });
  };

  readCongregations = (): Promise<Congregation[]> => {
    return firstValueFrom(this.angularFirestore.collection<Congregation>('Congregations').get()).then(query => {
      if (query.docs.length > 0) {
        return query.docs.map(doc => doc.data());
      } else {
        return Promise.reject('NOT_EXIST');
      }
    });
  };

  readSites = (): Promise<Site[]> => {
    return firstValueFrom(this.angularFirestore.collection<Site>('Sites').get()).then(query => {
      if (query.docs.length > 0) {
        return query.docs.map(doc => doc.data());
      } else {
        return Promise.reject('NOT_EXIST');
      }
    });
  };

  readShiftHoursList = (): Promise<ShiftHours[]> => {
    return firstValueFrom(this.angularFirestore.collection<ShiftHours>('ShiftHours').get()).then(query => {
      if (query.docs.length > 0) {
        return query.docs.map(doc => doc.data());
      } else {
        return Promise.reject('NOT_EXIST');
      }
    });
  };

  readShiftsByMonth = (yearMonth: string): Promise<Shift[]> => {
    return firstValueFrom(this.angularFirestore.collection<Shift>(['MonthlyData', yearMonth, 'Shifts'].join('/')).get()).then(query => {
      if (query.docs.length > 0) {
        return query.docs.map(doc => doc.data());
      } else {
        return Promise.reject('NOT_EXIST');
      }
    });
  };

  readShiftsByDate = (date: string): Promise<Shift[]> => {
    const yearMonth = date.slice(0, 7);
    return firstValueFrom(this.angularFirestore.collection<Shift>(
      ['MonthlyData', yearMonth, 'Shifts'].join('/'),
      document => document.where('date', '==', date)
    ).get()).then(query => {
      if (query.docs.length > 0) {
        return query.docs.map(doc => doc.data());
      } else {
        return Promise.reject('NOT_EXIST');
      }
    });
  };

  readShifts = (yearMonth: string, uuids: string[]): Promise<Shift[]> => {
    const setNumber = Math.ceil(uuids.length / 10);
    const uuidSets = [];
    for(let i = 0; i < setNumber; i++) {
      uuidSets.push(uuids.slice(i * 10, i * 10 +10));
    }
    return Promise.all(
      uuidSets.map(_uuids => {
        return firstValueFrom(this.angularFirestore.collection<Shift>(
          ['MonthlyData', yearMonth, 'Shifts'].join('/'),
          document => document.where('uuid', 'in', _uuids)
        ).get());
      })
    ).then(querys => {
      let _shifts: Shift[] = [];
      querys.map(query => query.docs.map(doc => doc.data())).forEach(_shiftSet => _shifts = _shifts.concat(_shiftSet));
      if (_shifts.length > 0) {
        return _shifts;
      } else {
        return Promise.reject('NOT_EXIST');
      }
    });
  };

  readShift = (yearMonth: string, uuid: string): Promise<Shift> => {
    return firstValueFrom(this.angularFirestore.collection<Shift>(
      ['MonthlyData', yearMonth, 'Shifts'].join('/'),
      document => document.where('uuid', '==', uuid)
    ).get()).then(query => {
      if (query.docs.length > 0) {
        return query.docs.map(doc => doc.data())[0];
      } else {
        return Promise.reject('NOT_EXIST');
      }
    });
  };

  updateShift = (shift: Shift): Promise<void> => {
    const yearMonth = shift.date.slice(0, 7);
    return this.angularFirestore.doc<Shift>(['MonthlyData', yearMonth, 'Shifts', shift.uuid].join('/')).update(shift);
  };

  readPersonalShift = (yearMonth: string, uuid: string): Promise<PersonalShifts> => {
    return firstValueFrom(this.angularFirestore.collection<PersonalShifts>(
      ['MonthlyData', yearMonth, 'PersonalShifts'].join('/'),
      document => document.where('uuid', '==', uuid)
    ).get()).then(query => {
      if (query.docs.length > 0) {
        return query.docs.map(doc => doc.data())[0];
      } else {
        return Promise.reject('NOT_EXIST');
      }
    });
  };

  readStatistic = (yearMonth: string, uuid: string): Promise<Statistic> => {
    return firstValueFrom(
      this.angularFirestore.doc<Statistic>(['MonthlyData', yearMonth, 'Statistics', uuid].join('/')).get()
    ).then(doc => {
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
    return this.angularFirestore.doc<Statistic>(['MonthlyData', yearMonth, 'Statistics', statistic.uuid].join('/')).set(statistic);
  };

  updateStatistic = (statistic: Statistic): Promise<void> => {
    const yearMonth = statistic.date.slice(0, 7);
    return this.angularFirestore.doc<Statistic>(['MonthlyData', yearMonth, 'Statistics', statistic.uuid].join('/')).update(statistic);
  };
}
