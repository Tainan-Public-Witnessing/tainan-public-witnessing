import { browser, $ } from 'protractor';

export class AppPage {

  navigateTo = (): void => {
    browser.get(browser.baseUrl);
  }

  getTitleText = (): Promise<string> => {
    browser.sleep(50);
    return $('#title').getText() as Promise<string>;
  }

  clickMenuButton = (): void => {
    $('#menuButton').click();
    browser.sleep(50);
  }

  isSidenavDisplayed = (): Promise<boolean> => {
    browser.sleep(500);
    return $('mat-sidenav').isDisplayed() as Promise<boolean>;
  }

  clickTranslateButton = (): void => {
    $('#translateButton').click();
    browser.sleep(50);
  }

  clickLanguageButtonZH = (): void => {
    $('#languageButtonZH').click();
    browser.sleep(50);
  }

  clickLoginButton = (): void => {
    $('#loginButton').click();
    browser.sleep(50);
  }

  clickLogoutButton = (): void => {
    $('#logoutButton').click();
    browser.sleep(50);
  }

  enterUsername = (username: string): void => {
    $('#usernameInput').sendKeys(username);
    browser.sleep(50);
  }

  enterPassword = (password: string): void => {
    $('#passwordInput').sendKeys(password);
    browser.sleep(50);
  }

  clickLoginSubmitButton = (): void => {
    $('#loginSubmitButton').click();
    browser.sleep(50);
  }

  getWelcomeMessage = (): Promise<string> => {
    browser.sleep(50);
    return $('.welcome-message').getText() as Promise<string>;
  }

  isWelcomeMessagePresent = (): Promise<boolean> => {
    browser.sleep(50);
    return $('.welcome-message').isPresent() as Promise<boolean>;
  }

  getUsernameNotExistErrorMessage = (): Promise<string> => {
    browser.sleep(50);
    return $('#usernameNotExistErrorMessage').getText() as Promise<string>;
  }

  getWrongPasswordErrorrMessage = (): Promise<string> => {
    browser.sleep(50);
    return $('#wrongPasswordErrorrMessage').getText() as Promise<string>;
  }

  clickMenuLink = (url: string): void => {
    $('#menuLink_' + url).click();
    browser.sleep(50);
  }

  getPageTitleText = (): Promise<string> => {
    browser.sleep(50);
    return $('h1').getText() as Promise<string>;
  }
}
