import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { FocusMonitor } from '@angular/cdk/a11y';
import { TranslateService } from '@ngx-translate/core';
import { Subject, fromEvent, of, BehaviorSubject } from 'rxjs';
import { takeUntil, map, switchAll, filter, startWith } from 'rxjs/operators';
import { GlobalEventService } from 'src/app/_services/global-event.service';
import { Language } from 'src/app/_enums/language.enum';
import { AuthorityService } from 'src/app/_services/authority.service';
import { DateAdapter } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import { UsersService } from './_services/users.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('menuButton') menuButton!: MatButton;

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
      .getGlobalEventById('ON_MENU_LINK_CLICK')
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
    this.dateAdapter.setLocale(environment.MOMENT_LOCALES['zh']);
  };

  onMenuButtonClick = () => {
    this.sidenav.toggle();
  };
}
