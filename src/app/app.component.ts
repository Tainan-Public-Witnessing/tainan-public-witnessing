import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { FocusMonitor } from '@angular/cdk/a11y';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GlobalEventService } from 'src/app/_services/global-event.service';
import { Language, MomentLocale } from 'src/app/_enums/language.enum';
import { AuthorityService } from 'src/app/_services/authority.service';
import { Api } from 'src/app/_api/mock.api';
import { DateAdapter } from '@angular/material/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild('menuButton') menuButton: MatButton;

  languages: string[] = Object.values(Language);
  unsubscribe$ = new Subject<void>();

  constructor(
    private authorityService: AuthorityService,
    private globalEventService: GlobalEventService,
    private translateService: TranslateService,
    private api: Api,
    private dateAdapter: DateAdapter<any>,
    private focusMonitor: FocusMonitor
  ) {}

  ngOnInit(): void {

    this.translateService.setDefaultLang(Language.EN);

    this.globalEventService.getGlobalEventById('ON_MENU_LINK_CLICK').pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.sidenav.close();
    });

    this.authorityService.initialize();
  }

  ngAfterViewInit(): void {
    this.focusMonitor.stopMonitoring(this.menuButton._elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.api.unsubscribeStreams();
  }

  onMenuButtonClick = () => {
    this.sidenav.toggle();
  }

  onLanguageButtonClick = (language: Language) => {
    this.translateService.use(language);
    this.dateAdapter.setLocale(MomentLocale[language.toUpperCase()]);
  }
}
