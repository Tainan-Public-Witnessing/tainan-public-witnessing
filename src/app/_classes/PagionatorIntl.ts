import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Injectable()
export class PaginatorIntl implements MatPaginatorIntl {
  private base = new MatPaginatorIntl();

  changes = new Subject<void>();

  itemsPerPageLabel: string;
  nextPageLabel: string;
  previousPageLabel: string;
  firstPageLabel: string;
  lastPageLabel: string;

  constructor(private translateServcie: TranslateService) {
    translateServcie.onLangChange.subscribe(this.loadTranslation);
    this.loadTranslation();
  }

  loadTranslation = () => {
    this.translateServcie
      .get([
        'GLOBAL.PAGINATOR.PAGE_SIZE',
        'GLOBAL.PAGINATOR.NEXT_PAGE',
        'GLOBAL.PAGINATOR.PREV_PAGE',
        'GLOBAL.PAGINATOR.FIRST_PAGE',
        'GLOBAL.PAGINATOR.LAST_PAGE',
      ])
      .subscribe((translations) => {
        this.itemsPerPageLabel = translations['GLOBAL.PAGINATOR.PAGE_SIZE'];
        this.nextPageLabel = translations['GLOBAL.PAGINATOR.NEXT_PAGE'];
        this.previousPageLabel = translations['GLOBAL.PAGINATOR.PREV_PAGE'];
        this.firstPageLabel = translations['GLOBAL.PAGINATOR.FIRST_PAGE'];
        this.lastPageLabel = translations['GLOBAL.PAGINATOR.LAST_PAGE'];

        this.changes.next();
      });
  };

  getRangeLabel = this.base.getRangeLabel;
}
