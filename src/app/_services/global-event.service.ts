import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { IGlobalEvent } from 'src/app/_interfaces/global-event.interface';

@Injectable({
  providedIn: 'root'
})
export class GlobalEventService {

  globalEvent$ = new Subject<IGlobalEvent>();

  constructor() { }

  emitGlobalEvent = (globalEvent: IGlobalEvent): void => {
    this.globalEvent$.next(globalEvent);
  }

  getGlobalEventById = (id: string): Observable<IGlobalEvent> => {
    return this.globalEvent$.pipe(
      filter(globalEvent => globalEvent.id === id)
    );
  }
}
