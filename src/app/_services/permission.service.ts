import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PermissionTable } from '../_interfaces/permission-table.interface';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  currentPermissionTable$ = new BehaviorSubject<PermissionTable>(null);

  constructor() { }

  getPermissionByKey = (key: string): Observable<boolean> => {
    return this.currentPermissionTable$.pipe(
      map(permissionTable => permissionTable[key])
    );
  }
}
