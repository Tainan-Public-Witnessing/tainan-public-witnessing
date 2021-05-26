import { browser, $ } from 'protractor';

export class GlobalE2e {

  login = (username: string, password: string) => {
    $('#usernameInput').sendKeys(username);
    browser.sleep(50);
    $('#passwordInput').sendKeys(password);
    browser.sleep(50);
    $('#loginSubmitButton').click();
    browser.sleep(50);
  }
}
