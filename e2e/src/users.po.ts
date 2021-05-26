import { browser, $ } from 'protractor';
import { User } from 'src/app/_interfaces/user.interface';

export class UsersPage {

  navigateTo = (): void => {
    browser.get(browser.baseUrl + '/users');
  }

  getPageTitleText = (): Promise<string> => {
    browser.sleep(50);
    return $('.title-bar h1').getText() as Promise<string>;
  }

  clickCreateUserButton = () => {
    $('#create-user-button').click();
    browser.sleep(50);
  }

  inputUserData = (userData: User) => {

  }
}
