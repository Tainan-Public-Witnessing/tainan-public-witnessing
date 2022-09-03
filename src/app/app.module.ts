import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/_modules/angular-material.module';
import { FirebaseModule } from 'src/app/_modules/firebase-develop.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { LoginDialogComponent } from './_elements/dialogs/login-dialog/login-dialog.component';
import { PersonalShiftComponent } from './personal-shift/personal-shift.component';
import { ShiftTableComponent } from './_elements/shift-table/shift-table.component';
import { ShiftCardComponent } from './_elements/shift-table/shift-card/shift-card.component';
import { StatisticEditorComponent } from './_elements/dialogs/statistic-editor/statistic-editor.component';
import { CrewEditorComponent } from './_elements/dialogs/crew-editor/crew-editor.component';
import { MemberInputComponent } from './_elements/dialogs/crew-editor/member-input/member-input.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './users/user/user.component';

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
