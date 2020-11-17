import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from 'src/app/home/home.component';
import { UsersComponent } from 'src/app/users/users.component';
import { CongregationsComponent } from 'src/app//congregations/congregations.component';
import { TagsComponent } from 'src/app/tags/tags.component';
import { ProfilesComponent } from 'src/app/profiles/profiles.component';
import { ProfileComponent } from 'src/app/profiles/profile/profile.component';
import { UserComponent } from 'src/app/users/user/user.component';


const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: 'home', component: HomeComponent},
  {path: 'users', component: UsersComponent},
  {path: 'user/:mode', component: UserComponent},
  {path: 'congregations', component: CongregationsComponent},
  {path: 'tags', component: TagsComponent},
  {path: 'profiles', component: ProfilesComponent},
  {path: 'profile/:mode', component: ProfileComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
