import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorityService } from 'src/app/_services/authority.service';

import { HomeComponent } from 'src/app/home/home.component';
import { UsersComponent } from 'src/app/users/users.component';
import { CongregationsComponent } from 'src/app//congregations/congregations.component';
import { TagsComponent } from 'src/app/tags/tags.component';
import { ProfilesComponent } from 'src/app/profiles/profiles.component';
import { ProfileComponent } from 'src/app/profiles/profile/profile.component';
import { UserComponent } from 'src/app/users/user/user.component';
import { importType } from '@angular/compiler/src/output/output_ast';


const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: 'home', component: HomeComponent, canActivate: [AuthorityService]},
  {path: 'users', component: UsersComponent, canActivate: [AuthorityService]},
  {path: 'user/:mode', component: UserComponent, canActivate: [AuthorityService]},
  {path: 'congregations', component: CongregationsComponent, canActivate: [AuthorityService]},
  {path: 'tags', component: TagsComponent, canActivate: [AuthorityService]},
  {path: 'profiles', component: ProfilesComponent, canActivate: [AuthorityService]},
  {path: 'profile/:mode', component: ProfileComponent, canActivate: [AuthorityService]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
