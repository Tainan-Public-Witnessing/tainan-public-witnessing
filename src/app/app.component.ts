import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GlobalEventService } from 'src/app/_services/global-event.service';
import { Language } from 'src/app/_enums/language.enum';
import { AuthorityService } from 'src/app/_services/authority.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;

  languages: string[] = Object.values(Language);
  unsubscribe$ = new Subject<void>();

  constructor(
    private authorityService: AuthorityService,
    private globalEventService: GlobalEventService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {

    this.translate.setDefaultLang(Language.EN);

    this.globalEventService.getGlobalEventById('ON_MENU_LINK_CLICK').pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.sidenav.close();
    });

    this.authorityService.initialize();
  }

  onMenuButtonClick = () => {
    this.sidenav.toggle();
  }

  onLanguageButtonClick = (language: Language) => {
    this.translate.use(language);
  }
}
