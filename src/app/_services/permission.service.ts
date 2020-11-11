import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Profile } from 'src/app/_interfaces/profile.interface';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  profile$ = new BehaviorSubject<Profile>(null);

  constructor() { }

  getPermissionByKey = (key: string): Observable<boolean> => {
    return this.profile$.pipe(
      map(profile => profile[key])
    );
  }
}
