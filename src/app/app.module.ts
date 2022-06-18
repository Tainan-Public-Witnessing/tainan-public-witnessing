import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { AngularFireModule } from '@angular/fire';
// import { AngularFirestoreModule } from '@angular/fire/firestore';

// import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/_modules/angular-material.module';
import { FirebaseModule } from 'src/app/_modules/firebase-develop.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
// import { UsersComponent } from './users/users.component';
// import { CongregationsComponent } from './congregations/congregations.component';
// import { CongregationDialogComponent } from './congregations/congregation-dialog/congregation-dialog.component';
// import { ConfirmDialogComponent } from './_elements/dialogs/confirm-dialog/confirm-dialog.component';
// import { TagsComponent } from './tags/tags.component';
// import { TagDialogComponent } from './tags/tag-dialog/tag-dialog.component';
// import { ProfilesComponent } from './profiles/profiles.component';
// import { ProfileComponent } from './profiles/profile/profile.component';
// import { UserComponent } from './users/user/user.component';
import { LoginDialogComponent } from './_elements/dialogs/login-dialog/login-dialog.component';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { PersonalShiftComponent } from './personal-shift/personal-shift.component';
import { ShiftTableComponent } from './_elements/shift-table/shift-table.component';
import { ShiftCardComponent } from './_elements/shift-table/shift-card/shift-card.component';
import { DatePipe } from '@angular/common';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from 'src/environments/environment.prod';
import { StatisticEditorComponent } from './_elements/dialogs/statistic-editor/statistic-editor.component';
import { CrewEditorComponent } from './_elements/dialogs/crew-editor/crew-editor.component';

// AoT requires an exported function for factories of translate module
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    // UsersComponent,
    // CongregationsComponent,
    // CongregationDialogComponent,
    // ConfirmDialogComponent,
    // TagsComponent,
    // TagDialogComponent,
    // ProfilesComponent,
    // ProfileComponent,
    // UserComponent,
    LoginDialogComponent,
    PersonalShiftComponent,
    ShiftTableComponent,
    ShiftCardComponent,
    StatisticEditorComponent,
    CrewEditorComponent,
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
        deps: [HttpClient]
      }
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
          dateInput: 'YYYY-MM-DD'
        },
      },
    },
    DatePipe,
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
