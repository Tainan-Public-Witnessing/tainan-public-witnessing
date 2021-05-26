import { browser, $ } from 'protractor';

export class UsersPage {

  navigateTo = (): void => {
    browser.get(browser.baseUrl + '/users');
  }

  getPageTitleText = (): Promise<string> => {
    browser.sleep(50);
    return $('.title-bar h1').getText() as Promise<string>;
  }
}
