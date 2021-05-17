import { EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';

export class TranslateServiceStub {
  onLangChange: EventEmitter<any> = new EventEmitter();
  onTranslationChange: EventEmitter<any> = new EventEmitter();
  onDefaultLangChange: EventEmitter<any> = new EventEmitter();
  setDefaultLang = (lang: string): void => {};
  use = (lang: string): Observable<any> => of();
  get = (key: string): Observable<any> => of('translate text');
}
