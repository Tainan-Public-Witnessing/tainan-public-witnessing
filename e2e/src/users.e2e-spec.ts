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

  it('should create user', () => {
    usersPage.clickCreateUserButton();
    usersPage.inputUserData({
      uuid: '',
      username: 'new user',
      name: 'user',
      gender: Gender.FEMALE,
      congregation: 'CONGREGATION_EAST_UUID',
      profile: 'PROFILE_MANAGER_UUID',
      baptizeDate: '2021-05-27',
      birthDate: '',
      tags: [],
      cellphone: '',
      phone: '',
      address: '',
      note: ''
    });
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
