import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { GlobalEvent } from 'src/app/_interfaces/global-event.interface';

@Injectable({
  providedIn: 'root',
})
export class GlobalEventService {
  globalEvent$ = new Subject<GlobalEvent>();

  constructor() {}

  emitGlobalEvent = (globalEvent: GlobalEvent): void => {
    this.globalEvent$.next(globalEvent);
  };

  getGlobalEventById = (id: string): Observable<GlobalEvent> => {
    return this.globalEvent$.pipe(
      filter((globalEvent) => globalEvent.id === id)
    );
  };
}

export const EVENTS = Object.freeze({
  SHIFTS_CHANGE: 'SHIFTS_CHANGE',
  ON_MENU_LINK_CLICK: 'ON_MENU_LINK_CLICK',
});
