import { browser, by, element, $ } from 'protractor';

export class AppPage {

  navigateTo = (): void => {
    browser.get(browser.baseUrl);
  }

  getTitleText = (): Promise<string> => {
    return $('#title').getText() as Promise<string>;
  }

  clickMenuButton = (): void => {
    $('#menuButton').click();
  }

  isSidenavDisplayed = (): Promise<boolean> => {
    browser.sleep(500);
    return $('mat-sidenav').isDisplayed() as Promise<boolean>;
  }

  clickTranslateButton = (): void => {
    $('#translateButton').click();
  }

  clickLanguageButtonZH = (): void => {
    $('#languageButtonZH').click();
  }

  clickLoginButton = (): void => {
    $('#loginButton').click();
  }

  enterUsername = (username: string): void => {
    $('#usernameInput').sendKeys(username);
  }

  enterPassword = (password: string): void => {
    $('#passwordInput').sendKeys(password);
  }

  clickLoginSubmitButton = (): void => {
    $('#loginSubmitButton').click();
  }

  getWelcomeMessage = (): Promise<string> => {
    return $('.welcome-message').getText() as Promise<string>;
  }

  getUsernameNotExistErrorMessage = (): Promise<string> => {
    browser.sleep(100);
    return $('#usernameNotExistErrorMessage').getText() as Promise<string>;
  }

  getWrongPasswordErrorrMessage = (): Promise<string> => {
    browser.sleep(100);
    return $('#wrongPasswordErrorrMessage').getText() as Promise<string>;
  }
}
