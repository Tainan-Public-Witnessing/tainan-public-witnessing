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
    page.enterUsername();
    page.enterPassword();
    page.clickLoginSubmitButton();
    expect(page.getWelcomeMessage()).toEqual('Hi! administrator');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
