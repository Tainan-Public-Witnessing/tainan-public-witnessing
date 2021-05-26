import { browser, $ } from 'protractor';

export class GlobalE2e {

  login = (username: string, password: string) => {
    $('#username-input').sendKeys(username);
    browser.sleep(50);
    $('#password-input').sendKeys(password);
    browser.sleep(50);
    $('#login-submit-button').click();
    browser.sleep(50);
  }
}
