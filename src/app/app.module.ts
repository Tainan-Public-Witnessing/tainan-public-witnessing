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
import { CongregationFormDialogComponent } from './congregations/congregation-form-dialog/congregation-form-dialog.component';
import { ConfirmDialogComponent } from './_elements/dialogs/confirm-dialog/confirm-dialog.component';
import { TagsComponent } from './tags/tags.component';
import { TagFormDialogComponent } from './tags/tag-form-dialog/tag-form-dialog.component';
import { ProfilesComponent } from './profiles/profiles.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    UsersComponent,
    CongregationsComponent,
    CongregationFormDialogComponent,
    ConfirmDialogComponent,
    TagsComponent,
    TagFormDialogComponent,
    ProfilesComponent,
  ],
  entryComponents: [
    CongregationFormDialogComponent,
    ConfirmDialogComponent,
    TagFormDialogComponent,
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
