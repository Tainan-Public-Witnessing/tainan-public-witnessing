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

  inputBaptizeDate = (date: string): void => {
    $('#baptize-date-input').sendKeys(date);
    browser.sleep(50);
  }

  pickBirthDateAsToday = (): void => {
    $('#birth-date-picker').click();
    browser.sleep(50);
    $('.mat-calendar-body-today').click();
    browser.sleep(50);
  }

  inputBirthDate = (date: string): void => {
    $('#birth-date-input').sendKeys(date);
    browser.sleep(50);
  }

  selectTags = (tags: string[]): void => {
    $('#tags-select').click();
    browser.sleep(50);
    tags.forEach(tag => {
      $('#tag-' + tag).click();
      browser.sleep(50);
    });
    $('.cdk-overlay-backdrop').click();
    browser.sleep(50);
  }

  inputCellphone = (cellphone: string): void => {
    $('#cellphone-input').sendKeys(cellphone);
    browser.sleep(50);
  }

  inputPhone = (phone: string): void => {
    $('#phone-input').sendKeys(phone);
    browser.sleep(50);
  }

  inputAddress = (address: string): void => {
    $('#address-input').sendKeys(address);
    browser.sleep(50);
  }

  inputNote = (note: string): void => {
    $('#note-input').sendKeys(note);
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
    this.pickBirthDateAsToday();
    this.selectTags(userData.tags);
    this.inputCellphone(userData.cellphone);
    this.inputPhone(userData.phone);
    this.inputAddress(userData.address);
    this.inputNote(userData.note);
  }
}
