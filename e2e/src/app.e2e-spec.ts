import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    page.navigateTo();
  });

  it('should initially display well', () => {
    expect(page.getTitleText()).toEqual('Tainan Public Witnessing');
  });

  it('should toggle menu if menuButton clicked', () => {
    page.clickMenuButton();
    expect(page.isSidenavDisplayed()).toEqual(true);

    page.clickMenuButton();
    expect(page.isSidenavDisplayed()).toEqual(false);
  });

  it('should switch language if languageButton clicked', () => {
    page.clickTranslateButton();
    page.clickLanguageButtonZH();
    expect(page.getTitleText()).toEqual('台南都市公眾見證');
  });

  it('should login seccessfully', () => {
    page.clickMenuButton();
    page.clickLoginButton();
    page.enterUsername('administrator');
    page.enterPassword('admin');
    page.clickLoginSubmitButton();
    expect(page.getWelcomeMessage()).toEqual('Hi! administrator');
  });

  it('should display error message if entering wrong username while login', () => {
    page.clickMenuButton();
    page.clickLoginButton();
    page.enterUsername('wrong name');
    page.enterPassword('admin');
    page.clickLoginSubmitButton();
    expect(page.getUsernameNotExistErrorMessage()).toEqual('User name do not exist!');
  });

  it('should display error message if entering wrong password while login', () => {
    page.clickMenuButton();
    page.clickLoginButton();
    page.enterUsername('administrator');
    page.enterPassword('wrong password');
    page.clickLoginSubmitButton();
    expect(page.getWrongPasswordErrorrMessage()).toEqual('Wrong password!');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
