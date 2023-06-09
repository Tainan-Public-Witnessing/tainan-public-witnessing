import { FocusMonitor } from '@angular/cdk/a11y';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { DateAdapter } from '@angular/material/core';
import { MatSidenav } from '@angular/material/sidenav';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, fromEvent, of, Subject } from 'rxjs';
import { filter, map, startWith, switchAll, takeUntil } from 'rxjs/operators';
import { Language } from 'src/app/_enums/language.enum';
import { AuthorityService } from 'src/app/_services/authority.service';
import {
  EVENTS,
  GlobalEventService,
} from 'src/app/_services/global-event.service';
import { environment } from 'src/environments/environment';
import { UsersService } from './_services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('menuButton') menuButton!: MatButton;

  readonly isDevMode = /-dev/i.test(environment.firebase.projectId);
  currentUsername$ = new BehaviorSubject<string | null>(null);
  displayUsername$ = new BehaviorSubject<boolean>(true);
  languages: string[] = Object.values(Language);
  destroy$ = new Subject<void>();

  constructor(
    private authorityService: AuthorityService,
    private usersService: UsersService,
    private globalEventService: GlobalEventService,
    private translateService: TranslateService,
    private dateAdapter: DateAdapter<any>,
    private focusMonitor: FocusMonitor
  ) {}

  ngOnInit(): void {
    fromEvent(window, 'resize')
      .pipe(
        takeUntil(this.destroy$),
        map(() => window.innerWidth),
        startWith(window.innerWidth),
        map((width) => width > 475)
      )
      .subscribe((displayUsername) =>
        this.displayUsername$.next(displayUsername)
      );

    this.translateService.setDefaultLang('zh');
    this.dateAdapter.setLocale(environment.MOMENT_LOCALES['zh']);

    if (localStorage.language) {
      this.translateService.use(localStorage.language);
    }

    this.authorityService.currentUserUuid$
      .pipe(
        takeUntil(this.destroy$),
        map((uuid) => {
          if (uuid) {
            return this.usersService.getUserByUuid(uuid).pipe(
              filter((user) => user !== null),
              map((user) => (user ? user.name : null))
            );
          } else {
            return of(null);
          }
        }),
        switchAll()
      )
      .subscribe((name) => this.currentUsername$.next(name));
  }

  ngAfterViewInit(): void {
    this.globalEventService
      .getGlobalEventById(EVENTS.ON_MENU_LINK_CLICK)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.sidenav.close();
      });

    this.focusMonitor.stopMonitoring(this.menuButton._elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLanguageButtonClick = (language: Language) => {
    this.translateService.use(language);
    localStorage.language = language;
    this.dateAdapter.setLocale(environment.MOMENT_LOCALES['zh']);
  };

  onMenuButtonClick = () => {
    this.sidenav.toggle();
  };
}
