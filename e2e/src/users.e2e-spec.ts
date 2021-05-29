import { UsersPage } from './users.po';
import { browser, logging } from 'protractor';
import { GlobalE2e } from './global.e2e';
import { Gender } from '../../src/app/_enums/gender.enum';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

describe('users page', () => {
  // const datePipe = new DatePipe('');

  const usersPage = new UsersPage();
  const globalE2e = new GlobalE2e();

  beforeEach(() => {
    usersPage.navigateTo();
    globalE2e.login('administrator', 'admin');
  });

  it('should initially display well', () => {
    expect(usersPage.getPageTitleText()).toEqual('Users');
  });

  it('should display user info if info button clicked', () => {
    usersPage.clickUserInfoButton();
    expect(usersPage.getFormText()).toMatch([
      'mock user',
      'mock user name',
      'Female',
      'East',
      'manager',
      '2020-01-01',
      '2000-01-01',
      'elder, pioneer',
      '0987654321',
      '0987654321',
      'Earth',
      'Nice guy'
    ].join(''));
  });

  it('should create user if create button clicked', () => {
    usersPage.clickCreateUserButton();
    usersPage.inputUserData({
      uuid: null,
      username: 'new user',
      name: 'new user name',
      gender: Gender.FEMALE,
      congregation: 'CONGREGATION_NORTH_UUID',
      profile: 'PROFILE_MANAGER_UUID',
      baptizeDate: 'today',
      birthDate: 'today',
      tags: ['TAG_ELDER_UUID'],
      cellphone: '0987654321',
      phone: '012345678',
      address: 'home',
      note: 'new!'
    }, { inputDate: false });
    usersPage.clickUserSubmitButton();
    expect(usersPage.getUsersListText()).toMatch('new user');

    usersPage.clickNewUserInfoButton();
    const today = moment().format('YYYY-MM-DD');
    expect(usersPage.getFormText()).toMatch([
      'new user',
      'new user name',
      'Female',
      'North',
      'manager',
      today,
      today,
      'elder',
      '0987654321',
      '012345678',
      'home',
      'new!'
    ].join(''));
  });

  it('sould eidt user if edit button clicked', () => {
    usersPage.clickUserEditButton();
    usersPage.inputUserData({
      uuid: null,
      username: 'edit user',
      name: 'edit user name',
      gender: Gender.MALE,
      congregation: 'CONGREGATION_WEST_UUID',
      profile: 'PROFILE_ADMINISTRATOR_UUID',
      baptizeDate: '2020-12-31',
      birthDate: '2000-12-31',
      tags: ['TAG_OVERSEER_UUID', 'TAG_ELDER_UUID', 'TAG_PIONEER_UUID'], // unchecked last 2
      cellphone: '0123456789',
      phone: '0123456789',
      address: 'home',
      note: 'eidt!'
    }, { inputDate: true });
    usersPage.clickUserSubmitButton();

    usersPage.clickUserInfoButton();
    expect(usersPage.getFormText()).toMatch([
      'edit user',
      'edit user name',
      'Male',
      'West',
      'administrator',
      '2020-12-31',
      '2000-12-31',
      'overseer',
      '0123456789',
      '0123456789',
      'home',
      'eidt!'
    ].join(''));
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
