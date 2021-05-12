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
    browser.sleep(400);
  }

  isSidenavDisplayed = (): Promise<boolean> => {
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

  enterUsername = (): void => {
    $('#usernameInput').sendKeys('administrator');
  }

  enterPassword = (): void => {
    $('#passwordInput').sendKeys('admin');
  }

  clickLoginSubmitButton = (): void => {
    $('#loginSubmitButton').click();
  }

  getWelcomeMessage = (): Promise<string> => {
    return $('.welcome-message').getText() as Promise<string>;
  }
}
