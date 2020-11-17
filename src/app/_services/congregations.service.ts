import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MockApi } from 'src/app/_api/mock.api';
import { Congregation } from 'src/app/_interfaces/congregation.interface';
import { Status } from '../_enums/status.enum';

@Injectable({
  providedIn: 'root'
})
export class CongregationsService {

  private congregations$ = new BehaviorSubject<Congregation[]>(null);

  constructor(
    private mockApi: MockApi
  ) { }

  getCongregations = (): BehaviorSubject<Congregation[]> => {
    if (!this.congregations$.getValue()) {
      this.mockApi.readCongregations().subscribe(this.congregations$);
    }
    return this.congregations$;
  }

  sortCongregations = (congregations: Congregation[]): Promise<Status> => {
    return this.mockApi.updateCongregations(congregations);
  }

  createCongregation = (congregation: Congregation): Promise<Status> => {
    const congregations = this.congregations$.getValue();
    if (congregations) {
      if (!congregations.find(c => c.name === congregation.name)) {
        return this.mockApi.createCongregation(congregation).then(() => Promise.resolve(Status.SUCCESS));
      } else {
        return Promise.reject(Status.EXISTED);
      }
    } else {
      return Promise.reject(Status.NOT_LOADED);
    }
  }

  updateCongregation = (congregation: Congregation): Promise<Status> => {
    const congregations = this.congregations$.getValue();
    if (congregations) {
      if (!congregations.find(c => c.name === congregation.name)) {
        return this.mockApi.updateCongregation(congregation);
      } else {
        return Promise.reject(Status.EXISTED);
      }
    } else {
      return Promise.reject(Status.NOT_LOADED);
    }
  }

  deleteCongregation = (uuid: string): Promise<Status> => {
    return this.mockApi.deleteCongregation(uuid);
  }
}
