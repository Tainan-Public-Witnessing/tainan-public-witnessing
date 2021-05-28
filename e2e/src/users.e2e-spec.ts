import { UsersPage } from './users.po';
import { browser, logging } from 'protractor';
import { GlobalE2e } from './global.e2e';
import { Gender } from '../../src/app/_enums/gender.enum';

describe('users page', () => {
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
    usersPage.clickAdministratorInfoButton();
    expect(usersPage.getFormText()).toMatch([
      'administrator',
      'administrator',
      'Male',
      'East',
      'administrator',
      '2020-04-01',
      '2020-04-01',
      'overseer, pioneer',
      '0987654321',
      '012345678',
      'home',
      'Can not be delete.'
    ].join(''));
  });

  it('should create user if create button clicked', () => {
    usersPage.clickCreateUserButton();
    usersPage.inputUserData({
      uuid: null,
      username: 'new user',
      name: 'user',
      gender: Gender.FEMALE,
      congregation: 'CONGREGATION_EAST_UUID',
      profile: 'PROFILE_MANAGER_UUID',
      baptizeDate: 'today',
      birthDate: 'today',
      tags: ['TAG_ELDER_UUID', 'TAG_PIONEER_UUID'],
      cellphone: '0987654321',
      phone: '012345678',
      address: 'home',
      note: 'a nice guy'
    });
    usersPage.clickCreateUserSubmitButton();
    expect(usersPage.getUsersListText()).toMatch('new user');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
