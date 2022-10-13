import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Api } from 'src/app/_api/mock.api';
import { Congregation } from 'src/app/_interfaces/congregation.interface';

@Injectable({
  providedIn: 'root',
})
export class CongregationsService {
  private congregations$: BehaviorSubject<Congregation[]> | undefined =
    undefined;

  constructor(private api: Api) {}

  public getCongregationList = () => {
    const $ = new BehaviorSubject<Congregation[] | null | undefined>(null);
    this.api
      .readCongregations()
      .then((values) => $.next(values))
      .catch(() => $.next(undefined));
    return $;
  };

  createCongregation = (cong: Omit<Congregation, 'uuid' | 'activate'>) => {
    return this.api.createCongregation(cong);
  }
}
