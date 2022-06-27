import { Gender } from "src/app/_enums/gender.enum";
import { Permission } from "src/app/_enums/permission.enum";
import { Congregation } from "src/app/_interfaces/congregation.interface";
import { PersonalShifts } from "src/app/_interfaces/personal-shifts.interface";
import { ShiftHours } from "src/app/_interfaces/shift-hours.interface";
import { Shift } from "src/app/_interfaces/shift.interface";
import { Site } from "src/app/_interfaces/site.interface";
import { Statistic } from "src/app/_interfaces/statistic.interface";
import { User, UserKey } from "src/app/_interfaces/user.interface";

export const ACCOUNTS: {uuid: string, password: string}[] = [
  {
    uuid: '73783509-ecf4-4522-924b-c782d41fb95c',
    password: 'DEV'
  }, {
    uuid: '620a6781-1ef4-4ac6-b23f-8efe20348907',
    password: 'ADMIN'
  }, {
    uuid: '9efe91be-3b71-40e7-8ea2-6e2768bb2ebd',
    password: 'MANAGER'
  }, {
    uuid: 'bdb0fd54-b203-4e87-b744-1867d7eb0932',
    password: 'USER'
  },
];

export const USER_KEYS: UserKey[] = [
  {
    uuid: '73783509-ecf4-4522-924b-c782d41fb95c',
    username: 'Phillip Tsai',
    activate: true,
  }, {
    uuid: '620a6781-1ef4-4ac6-b23f-8efe20348907',
    username: 'Amanda Tsai',
    activate: true,
  }, {
    uuid: '9efe91be-3b71-40e7-8ea2-6e2768bb2ebd',
    username: 'Peter Tsai',
    activate: true,
  }, {
    uuid: 'bdb0fd54-b203-4e87-b744-1867d7eb0932',
    username: 'Rachel Tsai',
    activate: true,
  },
];

export const USERS: User[] = [
  Object.assign({
    name: 'Phillip Tsai',
    gender: Gender.MALE,
    congregationUuid: '7e4fc670-12d9-483c-8fdc-2c0f1b6e889a',
    permission: Permission.DEVELOPER,
    baptizeDate: '2000-01-01',
    birthDate: '2000-01-01',
    cellphone: '',
    email: '',
    phone: '',
    address: '',
    note: '',
    tagUuids: ['']
  }, USER_KEYS[0]),
  Object.assign({
    name: 'Amanda Tsai',
    gender: Gender.FEMALE,
    congregationUuid: '7e4fc670-12d9-483c-8fdc-2c0f1b6e889a',
    permission: Permission.ADMINISTRATOR,
    baptizeDate: '2000-01-01',
    birthDate: '2000-01-01',
    cellphone: '',
    email: '',
    phone: '',
    address: '',
    note: '',
    tagUuids: ['']
  }, USER_KEYS[1]),
  Object.assign({
    name: 'Peter Tsai',
    gender: Gender.MALE,
    congregationUuid: '52a092bb-48b9-4a87-b269-c8774f844671',
    permission: Permission.MANAGER,
    baptizeDate: '2000-01-01',
    birthDate: '2000-01-01',
    cellphone: '',
    email: '',
    phone: '',
    address: '',
    note: '',
    tagUuids: ['']
  }, USER_KEYS[2]),
  Object.assign({
    name: 'Rachel Tsai',
    gender: Gender.FEMALE,
    congregationUuid: '52a092bb-48b9-4a87-b269-c8774f844671',
    permission: Permission.USER,
    baptizeDate: '2000-01-01',
    birthDate: '2000-01-01',
    cellphone: '',
    email: '',
    phone: '',
    address: '',
    note: '',
    tagUuids: ['']
  }, USER_KEYS[3]),
];

export const CONGREGATIONS: Congregation[] = [
  {
    uuid: '7e4fc670-12d9-483c-8fdc-2c0f1b6e889a',
    name: 'Tainan East',
    order: 0,
    activate: true,
  }, {
    uuid: '52a092bb-48b9-4a87-b269-c8774f844671',
    name: 'Tainan West',
    order: 1,
    activate: true,
  },
];

export const SITES: Site[] = [
  {
    uuid: '408941a1-3af4-4148-a822-baddd9fae407',
    name: 'Park',
    order: 0,
    activate: true,
  }, {
    uuid: '2ab1d2b4-e03b-47ba-991d-7ca801c79b0d',
    name: 'Station',
    order: 1,
    activate: true,
  },
];

export const SHIFT_HOURS_LIST: ShiftHours[] = [
  {
    uuid: '39cd7d33-ba5c-4967-8502-a1a57f557842',
    name: 'Morning',
    startTime: '09:00',
    endTime: '12:00',
    activate: true,
  }, {
    uuid: 'bb406de4-d090-413b-a68b-ad790a332699',
    name: 'Afternoon',
    startTime: '12:00',
    endTime: '15:00',
    activate: true,
  },
];

export const SHIFTS: Shift[] = [
  {
    uuid: '056f687d-2b0b-48ee-ba30-a4190a95cacb',
    date: '2022-06-13',
    shiftHoursUuid: '39cd7d33-ba5c-4967-8502-a1a57f557842',
    siteUuid: '408941a1-3af4-4148-a822-baddd9fae407',
    crewUuids: [
      '73783509-ecf4-4522-924b-c782d41fb95c',
      '620a6781-1ef4-4ac6-b23f-8efe20348907',
    ],
    activate: true,
    hasStatistic: true,
  }, {
    uuid: 'c1c9b287-1f8b-4364-810d-6218c535fb77',
    date: '2022-06-12',
    shiftHoursUuid: 'bb406de4-d090-413b-a68b-ad790a332699',
    siteUuid: '2ab1d2b4-e03b-47ba-991d-7ca801c79b0d',
    crewUuids: [
      '73783509-ecf4-4522-924b-c782d41fb95c',
      '9efe91be-3b71-40e7-8ea2-6e2768bb2ebd',
      'bdb0fd54-b203-4e87-b744-1867d7eb0932',
    ],
    activate: true,
  },
];

export const PERSONAL_SHIFTS_LIST: PersonalShifts[] = [
  {
    uuid: '73783509-ecf4-4522-924b-c782d41fb95c',
    shiftUuids: [
      '056f687d-2b0b-48ee-ba30-a4190a95cacb',
      'c1c9b287-1f8b-4364-810d-6218c535fb77',
    ],
  }, {
    uuid: '620a6781-1ef4-4ac6-b23f-8efe20348907',
    shiftUuids: [
      '056f687d-2b0b-48ee-ba30-a4190a95cacb',
    ],
  }, {
    uuid: '9efe91be-3b71-40e7-8ea2-6e2768bb2ebd',
    shiftUuids: [
      'c1c9b287-1f8b-4364-810d-6218c535fb77',
    ],
  }, {
    uuid: 'bdb0fd54-b203-4e87-b744-1867d7eb0932',
    shiftUuids: [
      'c1c9b287-1f8b-4364-810d-6218c535fb77',
    ],
  },
];

export const STATISTICS: Statistic[] = [
  {
    uuid: '056f687d-2b0b-48ee-ba30-a4190a95cacb',
    createdByUuid: '73783509-ecf4-4522-924b-c782d41fb95c',
    createdOn: new Date('2019-04-27 19:00'),
    date: '2022-06-13',
    attendance: 2,
    tracts: 3,
    scriptures: 4,
    videos: 5,
    acceptReturnVisit: 6,
    returnVisits: 7,
    experience: 'Good',
    activate: true,
  }
];