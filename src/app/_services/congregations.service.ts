import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Api } from 'src/app/_api';
import { Congregation } from 'src/app/_interfaces/congregation.interface';

@Injectable({
  providedIn: 'root',
})
export class CongregationsService {
  private congregations$: BehaviorSubject<Congregation[] | null> | undefined = undefined;

  constructor(private api: Api) { }

  getCongregations = () => {
    if (this.congregations$ === undefined) {
      this.congregations$ = new BehaviorSubject<Congregation[] | null>(null);
    }
    this.api.readCongregations().then((congs) => {
      this.congregations$?.next(congs);
    });
    return this.congregations$;
  };

  createCongregation = (cong: Omit<Congregation, 'uuid' | 'activate' | 'order'>) => {
    return this.api.createCongregation(cong);
  }
  updateCongregation = (cong: Omit<Congregation, 'activate' | 'order'>) => {
    return this.api.updateCongregation(cong);
  }
  changeCongregationsActivation = (cong: Congregation) => {
    return this.api.changeCongregationActivation(cong);
  };
}
