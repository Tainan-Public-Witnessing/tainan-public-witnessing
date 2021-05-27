import { browser, $ } from 'protractor';
import { User } from 'src/app/_interfaces/user.interface';
import { Gender } from 'src/app/_enums/gender.enum';

export class UsersPage {

  navigateTo = (): void => {
    browser.get(browser.baseUrl + '/users');
  }

  getPageTitleText = (): Promise<string> => {
    browser.sleep(50);
    return $('.title-bar h1').getText() as Promise<string>;
  }

  clickCreateUserButton = (): void => {
    $('#create-user-button').click();
    browser.sleep(50);
  }

  inputUsername = (username: string): void => {
    $('#username-input').sendKeys(username);
    browser.sleep(50);
  }

  inputName = (name: string): void => {
    $('#name-input').sendKeys(name);
    browser.sleep(50);
  }

  selectGender = (gender: Gender): void => {
    $('#gender-select').click();
    browser.sleep(50);
    $('#gender-' + gender.toLowerCase()).click();
    browser.sleep(50);
  }

  selectCongregation = (congregationUuid: string): void => {
    $('#congregation-select').click();
    browser.sleep(50);
    $('#congregation-' + congregationUuid).click();
    browser.sleep(50);
  }

  selectProfile = (profileUuid: string): void => {
    $('#profile-select').click();
    browser.sleep(50);
    $('#profile-' + profileUuid).click();
    browser.sleep(50);
  }

  pickBaptizeDateAsToday = (): void => {
    $('#baptize-date-picker').click();
    browser.sleep(50);
    $('.mat-calendar-body-today').click();
    browser.sleep(50);
  }

  clickCreateUserSubmitButton = (): void => {
    $('#create-user-submit-button').click();
    browser.sleep(50);
  }

  getUsersListText = (): Promise<string> => {
    return $('#users-list').getText() as Promise<string>;
  }

  inputUserData = (userData: User) => {
    this.inputUsername(userData.username);
    this.inputName(userData.name);
    this.selectGender(userData.gender);
    this.selectCongregation(userData.congregation);
    this.selectProfile(userData.profile);
    this.pickBaptizeDateAsToday();
    this.clickCreateUserSubmitButton();
  }
}
