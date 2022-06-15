import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Api } from 'src/app/_api/mock.api';
import { Congregation } from 'src/app/_interfaces/congregation.interface';

@Injectable({
  providedIn: 'root'
})
export class CongregationsService {

  private congregations$: BehaviorSubject<Congregation[]> | undefined = undefined;

  constructor(
    private api: Api
  ) { }

}
