import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MockApi } from 'src/app/_api/mock.api';
import { Congregation } from 'src/app/_interfaces/congregation.interface';

@Injectable({
  providedIn: 'root'
})
export class CongregationsService {

  congregations$ = new BehaviorSubject<Congregation[]>(null);

  constructor(
    private mockApi: MockApi
  ) { }

  loadCongregations = () => {
    if (!this.congregations$.getValue()) {
      this.mockApi.readCongregations().subscribe(this.congregations$);
    }
  }

  sortCongregations = (congregations: Congregation[]) => {
    return this.mockApi.sortCongregations(congregations);
  }

  createCongregation = (congregation: Congregation): Promise<any> => {
    const congregations = this.congregations$.getValue();
    if (congregations) {
      if (!congregations.find(c => c.name === congregation.name)) {
        return this.mockApi.createCongregation(congregation);
      } else {
        return Promise.reject('CONGREGATION_NAME_EXISTED');
      }
    } else {
      return Promise.reject('CONGREGATIONS_NOT_LOADED');
    }
  }

  updateCongregation = (congregation: Congregation) => {
    const congregations = this.congregations$.getValue();
    if (congregations) {
      if (!congregations.find(c => c.name === congregation.name)) {
        return this.mockApi.updateCongregation(congregation);
      } else {
        return Promise.reject('CONGREGATION_NAME_EXISTED');
      }
    } else {
      return Promise.reject('CONGREGATIONS_NOT_LOADED');
    }
  }

  deleteCongregation = (uuid: string) => {
    return this.mockApi.deleteCongregation(uuid);
  }
}
