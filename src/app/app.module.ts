import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from 'src/app/_modules/angular-material.module';

import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CongregationsComponent } from './congregations/congregations.component';
import { CongregationDialogComponent } from './congregations/congregation-dialog/congregation-dialog.component';
import { ConfirmDialogComponent } from './_elements/dialogs/confirm-dialog/confirm-dialog.component';
import { TagsComponent } from './tags/tags.component';
import { TagDialogComponent } from './tags/tag-dialog/tag-dialog.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { ProfileComponent } from './profiles/profile/profile.component';
import { UserComponent } from './users/user/user.component';
import { LoginDialogComponent } from './_elements/dialogs/login-dialog/login-dialog.component';

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
    AngularMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
