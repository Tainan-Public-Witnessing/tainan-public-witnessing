import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/_modules/angular-material.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { CongregationsComponent } from './congregations/congregations.component';
import { CongregationDialogComponent } from './congregations/congregation-dialog/congregation-dialog.component';
import { ConfirmDialogComponent } from './_elements/dialogs/confirm-dialog/confirm-dialog.component';
import { TagsComponent } from './tags/tags.component';
import { TagDialogComponent } from './tags/tag-dialog/tag-dialog.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { ProfileComponent } from './profiles/profile/profile.component';
import { UserComponent } from './users/user/user.component';
import { LoginDialogComponent } from './_elements/dialogs/login-dialog/login-dialog.component';

// AoT requires an exported function for factories of translate module
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    UsersComponent,
    CongregationsComponent,
    CongregationDialogComponent,
    ConfirmDialogComponent,
    TagsComponent,
    TagDialogComponent,
    ProfilesComponent,
    ProfileComponent,
    UserComponent,
    LoginDialogComponent,
  ],
  entryComponents: [
    CongregationDialogComponent,
    ConfirmDialogComponent,
    TagDialogComponent,
    LoginDialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
