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
    $('#menu-button').click();
    browser.sleep(50);
  }

  isSidenavDisplayed = (): Promise<boolean> => {
    browser.sleep(500);
    return $('mat-sidenav').isDisplayed() as Promise<boolean>;
  }

  clickTranslateButton = (): void => {
    $('#translate-button').click();
    browser.sleep(50);
  }

  clickLanguageButtonZH = (): void => {
    $('#language-button-zh').click();
    browser.sleep(50);
  }

  clickLoginButton = (): void => {
    $('#login-button').click();
    browser.sleep(50);
  }

  clickLogoutButton = (): void => {
    $('#logout-button').click();
    browser.sleep(50);
  }

  enterUsername = (username: string): void => {
    $('#username-input').sendKeys(username);
    browser.sleep(50);
  }

  enterPassword = (password: string): void => {
    $('#password-input').sendKeys(password);
    browser.sleep(50);
  }

  clickLoginSubmitButton = (): void => {
    $('#login-submit-button').click();
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
    return $('#username-not-exist-error-message').getText() as Promise<string>;
  }

  getWrongPasswordErrorrMessage = (): Promise<string> => {
    browser.sleep(50);
    return $('#wrong-password-error-message').getText() as Promise<string>;
  }

  clickMenuLink = (url: string): void => {
    $('#menu-link-' + url).click();
    browser.sleep(50);
  }

  getPageTitleText = (): Promise<string> => {
    browser.sleep(50);
    return $('.title-bar h1').getText() as Promise<string>;
  }
}
