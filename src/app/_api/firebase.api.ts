import { Injectable } from '@angular/core';
import { ApiInterface } from 'src/app/_api/api.interface';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { Congregation } from '../_interfaces/congregation.interface';
import { PersonalShift } from '../_interfaces/personal-shift.interface';
import { ShiftHours } from '../_interfaces/shift-hours.interface';
import { ShiftKey, Shift } from '../_interfaces/shift.interface';
import { Site } from '../_interfaces/site.interface';
import { UserKey, User } from '../_interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class Api implements ApiInterface {

  private readonly mailSurfix = '@mail.tpw';

  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
  ) {}

  login: (uuid: string, password: string) => Promise<void>;
  logout: (uuid: string) => Promise<void>;

  readUserKeys: () => Promise<UserKey[]>;

  readUser: (uuid: string) => Promise<User>;

  readCongregations: () => Promise<Congregation[]>;

  readSites: () => Promise<Site[]>;

  readShiftHoursList: () => Promise<ShiftHours[]>;

  readShiftKeysByMonth: (yearMonth: string) => Promise<ShiftKey[]>; // yyyy-MM
  readShiftKeysByDate: (date: string) => Promise<ShiftKey[]>; // yyyy-MM-dd

  readShift: (uuid: string) => Promise<Shift>;
  readShifts: (uuids: string[]) => Promise<Shift[]>;

  readPersonalShift: (uuid: string) => Promise<PersonalShift>;
}
