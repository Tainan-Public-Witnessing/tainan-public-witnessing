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
    this.mockApi.sortCongregations(congregations);
  }

  createCongregation = (congregation: Congregation) => {
    this.mockApi.createCongregation(congregation);
  }

  updateCongregation = (congregation: Congregation) => {
    this.mockApi.updateCongregation(congregation);
  }

  deleteCongregation = (uuid: string) => {
    this.mockApi.deleteCongregation(uuid);
  }
}
