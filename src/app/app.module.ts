import { DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularMaterialModule } from 'src/app/_modules/angular-material.module';
import { FirebaseModule } from 'src/app/_modules/firebase.module';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { OpeningShiftsComponent } from './opening-shifts/opening-shifts.component';
import { PersonalShiftComponent } from './personal-shift/personal-shift.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { UserDataComponent } from './users/user/user-data/user-data.component';
import { CalendarHeaderComponent } from './users/user/user-schedule/calendar-header/calendar-header.component';
import { HoursListComponent } from './users/user/user-schedule/hours-list/hours-list.component';
import { HoursTableComponent } from './users/user/user-schedule/hours-table/hours-table.component';
import { UserScheduleComponent } from './users/user/user-schedule/user-schedule.component';
import { UserComponent } from './users/user/user.component';
import { UsersComponent } from './users/users.component';
import { ForceRefreshDirective } from './_directives/force-refresh.directive';
import { ConfirmDialogComponent } from './_elements/dialogs/confirm-dialog/confirm-dialog.component';
import { CrewEditorComponent } from './_elements/dialogs/crew-editor/crew-editor.component';
import { MemberInputComponent } from './_elements/dialogs/crew-editor/member-input/member-input.component';
import { LoginDialogComponent } from './_elements/dialogs/login-dialog/login-dialog.component';
import { StatisticEditorComponent } from './_elements/dialogs/statistic-editor/statistic-editor.component';
import { ShiftCardComponent } from './_elements/shift-table/shift-card/shift-card.component';
import { ShiftTableComponent } from './_elements/shift-table/shift-table.component';
import { ArrayFilterPipe } from './_pipes/array-filter.pipe';
import { SettingsComponent } from './settings/settings.component';
import { SiteComponent } from './settings/site/site.component';
import { ShfithoursComponent } from './settings/shfithours/shfithours.component';
import { CongregationsComponent } from './settings/congregations/congregations.component';
import { SiteEditorComponent } from './_elements/dialogs/site-editor/site-editor.component';
import { SiteCreatorComponent } from './_elements/dialogs/site-creator/site-creator.component';

import { YearMonthSelectComponent } from './_elements/year-month-select/year-month-select.component';

// AoT requires an exported function for factories of translate module
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    LoginDialogComponent,
    PersonalShiftComponent,
    ShiftTableComponent,
    ShiftCardComponent,
    StatisticEditorComponent,
    CrewEditorComponent,
    MemberInputComponent,
    ShiftsComponent,
    UsersComponent,
    UserComponent,
    ConfirmDialogComponent,
    UserDataComponent,
    UserScheduleComponent,
    HoursTableComponent,
    CalendarHeaderComponent,
    ForceRefreshDirective,
    HoursListComponent,
    SettingsComponent,
    SiteComponent,
    ShfithoursComponent,
    CongregationsComponent,
    SiteEditorComponent,
    SiteCreatorComponent,
    OpeningShiftsComponent,
    YearMonthSelectComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FirebaseModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['YYYY-MM-DD'],
        },
        display: {
          dateInput: 'YYYY-MM-DD',
        },
      },
    },
    DatePipe,
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
