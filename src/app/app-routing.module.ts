import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from 'src/app/home/home.component';
import { UsersComponent } from 'src/app/users/users.component';
import { CongregationsComponent } from 'src/app//congregations/congregations.component';
import { TagsComponent } from 'src/app/tags/tags.component';
import { ProfilesComponent } from 'src/app/profiles/profiles.component';
import { ProfileFormComponent } from 'src/app/profiles/profile-form/profile-form.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'users', component: UsersComponent},
  {path: 'congregations', component: CongregationsComponent},
  {path: 'tags', component: TagsComponent},
  {path: 'profiles', component: ProfilesComponent},
  {path: 'profiles/:mode/:uuid', component: ProfileFormComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
