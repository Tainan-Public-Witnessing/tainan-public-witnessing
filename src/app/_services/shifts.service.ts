import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { Api } from '../_api';
import { EXISTED_ERROR } from '../_classes/errors/EXISTED_ERROR';
import { TOO_MANY_SHIFTS_ERROR } from '../_classes/errors/TOO_MANY_SHIFTS_ERROR';
import { queryWithLargeArray } from '../_helpers/firebase-helper';
import { extractPromise } from '../_helpers/promise-helper';
import { PersonalShifts } from '../_interfaces/personal-shifts.interface';
import { Shift } from '../_interfaces/shift.interface';

@Injectable({
  providedIn: 'root',
})
export class ShiftsService {
  private shiftSets = new Map<
    string,
    BehaviorSubject<Shift[] | null | undefined>
  >();
  private shifts = new Map<string, BehaviorSubject<Shift | null | undefined>>();

  constructor(private api: Api, private db: AngularFirestore) {}

  getShiftsByMonth = (
    yearMonth: string
  ): BehaviorSubject<Shift[] | null | undefined> => {
    // yyyy-MM
    if (!this.shiftSets.has(yearMonth)) {
      const shifts$ = new BehaviorSubject<Shift[] | null | undefined>(null);
      this.shiftSets.set(yearMonth, shifts$);
      this.api
        .readShiftsByMonth(yearMonth)
        .then((shifts) => {
          shifts$.next(shifts);
          shifts.forEach((_shift) => this.addShiftToCache(_shift));
        })
        .catch((reason) => {
          shifts$.next(undefined);
        });
    }
    return this.shiftSets.get(yearMonth) as BehaviorSubject<
      Shift[] | null | undefined
    >;
  };

  getShiftsByDate = (
    date: string
  ): BehaviorSubject<Shift[] | null | undefined> => {
    // yyyy-MM-dd
    if (!this.shiftSets.has(date)) {
      const shifts$ = new BehaviorSubject<Shift[] | null | undefined>(null);
      this.shiftSets.set(date, shifts$);

      const yearMonth = date.slice(0, 7); // yyyy-MM
      if (this.shiftSets.has(yearMonth)) {
        this.shiftSets
          .get(yearMonth)
          ?.pipe(
            filter((_shiftSet) => _shiftSet !== null),
            first(),
            map((_shiftSet) =>
              _shiftSet?.filter((_shift) => _shift.date === date)
            ),
            map((_shiftSet) => _shiftSet as Shift[])
          )
          .subscribe((_shiftSet) => {
            if (_shiftSet.length > 0) {
              shifts$.next(_shiftSet);
            } else {
              shifts$.next(undefined);
            }
          });
      } else {
        this.api
          .readShiftsByDate(date)
          .then((shifts) => {
            shifts.forEach((_shift) => this.addShiftToCache(_shift));
            shifts$.next(shifts);
          })
          .catch((reason) => {
            shifts$.next(undefined);
          });
      }
    }
    return this.shiftSets.get(date) as BehaviorSubject<
      Shift[] | null | undefined
    >;
  };

  getShiftsByUuids = (
    yearMonth: string,
    uuids: string[]
  ): BehaviorSubject<Shift | null | undefined>[] => {
    const uuidsForApi = uuids.filter((uuid) => !this.shifts.has(uuid));
    if (uuidsForApi.length > 0) {
      uuidsForApi.forEach((uuid) => {
        const shift$ = new BehaviorSubject<Shift | null | undefined>(null);
        this.shifts.set(uuid, shift$);
      });
      this.api.readShifts(yearMonth, uuidsForApi).then((shifts) => {
        uuidsForApi.forEach((uuid) => {
          const index = shifts.findIndex((_shift) => _shift.uuid === uuid);
          const shift$ = this.shifts.get(uuid);
          if (index > -1) {
            shift$?.next(shifts[index]);
          } else {
            shift$?.next(undefined);
          }
        });
      });
    }
    return uuids.map(
      (uuid) =>
        this.shifts.get(uuid) as BehaviorSubject<Shift | null | undefined>
    );
  };

  getShiftByUuid = (
    yearMonth: string,
    uuid: string
  ): BehaviorSubject<Shift | null | undefined> => {
    if (!this.shifts.has(uuid)) {
      const shift$ = new BehaviorSubject<Shift | null | undefined>(null);
      this.shifts.set(uuid, shift$);
      this.api
        .readShift(yearMonth, uuid)
        .then((shift) => {
          shift$.next(shift);
        })
        .catch((reason) => {
          shift$.next(undefined);
        });
    }
    return this.shifts.get(uuid) as BehaviorSubject<Shift | null | undefined>;
  };

  updateShift = (shift: Shift): Promise<void> => {
    return this.api.updateShift(shift).then(() => {
      this.shifts.get(shift.uuid)?.next(shift);
    });
  };

  private addShiftToCache = (shift: Shift | undefined) => {
    if (shift !== undefined) {
      if (!this.shifts.has(shift.uuid)) {
        const shift$ = new BehaviorSubject<Shift | null | undefined>(null);
        this.shifts.set(shift.uuid, shift$);
      }
      this.shifts.get(shift.uuid)?.next(shift);
    }
  };

  public async getOpeningShift(yearMonth: string, userUuid: string) {
    const personalShifts = (
      await firstValueFrom(
        this.db
          .doc<PersonalShifts>(
            `/MonthlyData/${yearMonth}/PersonalShifts/${userUuid}`
          )
          .get()
      )
    ).data();
    const joinedShifts = personalShifts?.shiftUuids
      ? await queryWithLargeArray<Shift>(
          personalShifts.shiftUuids,
          async (partial) =>
            await this.db.firestore
              .collection(`/MonthlyData/${yearMonth}/Shifts`)
              .where('uuid', 'in', partial)
              .get()
        )
      : [];
    const joinedDates = joinedShifts.map((shift) => shift.date);

    const openingShifts = (
      await this.db.firestore
        .collection(`/MonthlyData/${yearMonth}/Shifts`)
        .where('date', '>', new Date().toJSON().slice(0, 10))
        .where('full', '==', false)
        .get()
    ).docs.map((doc) => doc.data()) as Shift[];

    return openingShifts
      .filter((shift) => !shift.crewUuids.includes(userUuid))
      .filter((shift) => !joinedDates.includes(shift.date));
  }

  public async joinShift(shift: Shift, userUuid: string) {
    const { promise, reject, resolve } = extractPromise<void>();
    const yearMonth = shift.date.slice(0, 7);
    const firestore = this.db.firestore;

    const shiftRef = firestore.doc(
      `MonthlyData/${yearMonth}/Shifts/${shift.uuid}`
    );
    const personalShiftRef = firestore.doc(
      `/MonthlyData/${yearMonth}/PersonalShifts/${userUuid}`
    );

    firestore
      .runTransaction(async (transaction) => {
        const personalShifts = (
          await transaction.get(personalShiftRef)
        ).data() as PersonalShifts | undefined;

        if (!!personalShifts && personalShifts.shiftUuids.length >= 10) {
          return reject(new TOO_MANY_SHIFTS_ERROR());
        }

        const shiftData = (await transaction.get(shiftRef)).data() as Shift;

        if (shiftData.crewUuids.includes(userUuid)) {
          return reject(new EXISTED_ERROR('crewUuids'));
        }

        if (shiftData.crewUuids.length >= shiftData.attendance) {
          return reject(new TOO_MANY_SHIFTS_ERROR());
        }

        shiftData.crewUuids.push(userUuid);
        shiftData.full = shiftData.attendance <= shiftData.crewUuids.length;
        transaction.update(shiftRef, shiftData);
        if (personalShifts) {
          personalShifts.shiftUuids.push(shift.uuid);
          transaction.update(personalShiftRef, personalShifts);
        } else {
          transaction.set(personalShiftRef, {
            yearMonth,
            shiftUuids: [shift.uuid],
            uuid: userUuid,
          } as PersonalShifts);
        }
      })
      .then(() => {
        resolve();
      });

    return promise;
  }
}
