import { UsersPage } from './users.po';
import { browser, logging } from 'protractor';
import { GlobalE2e } from './global.e2e';

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

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
