import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPermissionTable } from '../_interfaces/permission-table.interface';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  currentPermissionTable$ = new BehaviorSubject<IPermissionTable>(null);

  constructor() { }

  getPermissionByKey = (key: string): Observable<boolean> => {
    return this.currentPermissionTable$.pipe(
      map(permissionTable => permissionTable[key])
    );
  }
}
