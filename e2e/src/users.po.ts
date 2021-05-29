import { browser, $, Key, element, by } from 'protractor';
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

  clickUserInfoButton = (): void => {
    $('#USER_USER_UUID #info-button').click();
    browser.sleep(50);
  }

  clickNewUserInfoButton = (): void => {
    element(by.cssContainingText('.mat-list-item', 'new user'));
    browser.sleep(50);
  }

  clickUserEditButton = () => {
    $('#USER_USER_UUID #edit-button').click();
    browser.sleep(50);
  }

  getFormText = (): Promise<string> => {
    browser.sleep(50);
    return Promise.all([
      $('#username-input').getAttribute('value'),
      $('#name-input').getAttribute('value'),
      $('#gender-select').getText(),
      $('#congregation-select').getText(),
      $('#profile-select').getText(),
      $('#baptize-date-input').getAttribute('value'),
      $('#birth-date-input').getAttribute('value'),
      $('#tags-select').getText(),
      $('#cellphone-input').getAttribute('value'),
      $('#phone-input').getAttribute('value'),
      $('#address-input').getAttribute('value'),
      $('#note-input').getAttribute('value')
    ]).then(texts => {
      return texts.join('');
    });
  }

  clickCreateUserButton = (): void => {
    $('#create-user-button').click();
    browser.sleep(50);
  }

  inputUsername = (username: string): void => {
    const usernameInput = $('#username-input');
    usernameInput.clear();
    usernameInput.sendKeys(username);
    browser.sleep(50);
  }

  inputName = (name: string): void => {
    const nameInput = $('#name-input');
    nameInput.clear();
    nameInput.sendKeys(name);
    browser.sleep(50);
  }

  selectGender = (gender: Gender): void => {
    $('#gender-select').click();
    browser.sleep(50);
    $('#' + gender.toLowerCase()).click();
    browser.sleep(50);
  }

  selectCongregation = (congregationUuid: string): void => {
    $('#congregation-select').click();
    browser.sleep(50);
    $('#' + congregationUuid).click();
    browser.sleep(50);
  }

  selectProfile = (profileUuid: string): void => {
    $('#profile-select').click();
    browser.sleep(50);
    $('#' + profileUuid).click();
    browser.sleep(50);
  }

  pickBaptizeDateAsToday = (): void => {
    $('#baptize-date-picker').click();
    browser.sleep(50);
    $('.mat-calendar-body-today').click();
    browser.sleep(50);
  }

  inputBaptizeDate = (date: string): void => {
    const baptizeDateInput = $('#baptize-date-input');
    baptizeDateInput.sendKeys(Key.chord(Key.CONTROL, 'a'));
    baptizeDateInput.sendKeys(Key.DELETE);
    baptizeDateInput.sendKeys(date);
    browser.sleep(50);
  }

  pickBirthDateAsToday = (): void => {
    $('#birth-date-picker').click();
    browser.sleep(50);
    $('.mat-calendar-body-today').click();
    browser.sleep(50);
  }

  inputBirthDate = (date: string): void => {
    const birthDateInput = $('#birth-date-input');
    birthDateInput.sendKeys(Key.chord(Key.CONTROL, 'a'));
    birthDateInput.sendKeys(Key.DELETE);
    birthDateInput.sendKeys(date);
    browser.sleep(50);
  }

  selectTags = (tagUuids: string[]): void => {
    $('#tags-select').click();
    browser.sleep(50);
    tagUuids.forEach(tagUuid => {
      $('#' + tagUuid).click();
      browser.sleep(50);
    });
    $('.cdk-overlay-backdrop').click();
    browser.sleep(50);
  }

  inputCellphone = (cellphone: string): void => {
    const cellphoneInput = $('#cellphone-input');
    cellphoneInput.clear();
    cellphoneInput.sendKeys(cellphone);
    browser.sleep(50);
  }

  inputPhone = (phone: string): void => {
    const phoneInput = $('#phone-input');
    phoneInput.clear();
    phoneInput.sendKeys(phone);
    browser.sleep(50);
  }

  inputAddress = (address: string): void => {
    const addressInput = $('#address-input');
    addressInput.clear();
    addressInput.sendKeys(address);
    browser.sleep(50);
  }

  inputNote = (note: string): void => {
    const noteInput = $('#note-input');
    noteInput.clear();
    noteInput.sendKeys(note);
    browser.sleep(50);
  }

  clickUserSubmitButton = (): void => {
    $('#create-user-submit-button').click();
    browser.sleep(50);
  }

  getUsersListText = (): Promise<string> => {
    return $('#users-list').getText() as Promise<string>;
  }

  inputUserData = (userData: User, options?: { inputDate: boolean }) => {
    this.inputUsername(userData.username);
    this.inputName(userData.name);
    this.selectGender(userData.gender);
    this.selectCongregation(userData.congregation);
    this.selectProfile(userData.profile);
    if (options.inputDate) {
      this.inputBaptizeDate(userData.baptizeDate);
      this.inputBirthDate(userData.birthDate);
    } else {
      this.pickBaptizeDateAsToday();
      this.pickBirthDateAsToday();
    }
    this.selectTags(userData.tags);
    this.inputCellphone(userData.cellphone);
    this.inputPhone(userData.phone);
    this.inputAddress(userData.address);
    this.inputNote(userData.note);
  }
}
