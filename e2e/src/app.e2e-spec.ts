import { AppPage } from './app.po';
import { browser, logging } from 'protractor';
import { GlobalE2e } from './global.e2e';

describe('app page', () => {
  const appPage = new AppPage();
  const globalE2e = new GlobalE2e();

  beforeEach(() => {
    appPage.navigateTo();
  });

  it('should initially display well', () => {
    expect(appPage.getTitleText()).toEqual('Tainan Public Witnessing');
    expect(appPage.isWelcomeMessagePresent()).toEqual(false);
  });

  it('should toggle menu if menuButton clicked', () => {
    appPage.clickMenuButton();
    expect(appPage.isSidenavDisplayed()).toEqual(true);

    appPage.clickMenuButton();
    expect(appPage.isSidenavDisplayed()).toEqual(false);
  });

  it('should switch language if languageButton clicked', () => {
    appPage.clickTranslateButton();
    appPage.clickLanguageButtonZH();
    expect(appPage.getTitleText()).toEqual('台南都市公眾見證');
  });

  it('should login and logout seccessfully', () => {
    appPage.clickMenuButton();
    appPage.clickLoginButton();
    globalE2e.login('administrator', 'admin');
    expect(appPage.getWelcomeMessage()).toEqual('Hi! administrator');

    appPage.clickMenuButton();
    appPage.clickLogoutButton();
    expect(appPage.isWelcomeMessagePresent()).toEqual(false);
  });

  it('should display error message if entering wrong username while login', () => {
    appPage.clickMenuButton();
    appPage.clickLoginButton();
    globalE2e.login('wrong name', 'admin');
    expect(appPage.getUsernameNotExistErrorMessage()).toEqual('User name do not exist!');
  });

  it('should display error message if entering wrong password while login', () => {
    appPage.clickMenuButton();
    appPage.clickLoginButton();
    globalE2e.login('administrator', 'wrong password');
    expect(appPage.getWrongPasswordErrorrMessage()).toEqual('Wrong password!');
  });

  it('should goto correct page if menuLink clicked', () => {
    appPage.clickMenuButton();
    appPage.clickLoginButton();
    globalE2e.login('administrator', 'admin');

    appPage.clickMenuButton();
    appPage.clickMenuLink('users');
    expect(appPage.getPageTitleText()).toEqual('Users');

    appPage.clickMenuButton();
    appPage.clickMenuLink('congregations');
    expect(appPage.getPageTitleText()).toEqual('Congregations');

    appPage.clickMenuButton();
    appPage.clickMenuLink('tags');
    expect(appPage.getPageTitleText()).toEqual('Tags');

    appPage.clickMenuButton();
    appPage.clickMenuLink('profiles');
    expect(appPage.getPageTitleText()).toEqual('Profiles');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
