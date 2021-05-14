import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorityGuardService } from 'src/app/_services/authority-guard.service';

import { HomeComponent } from 'src/app/home/home.component';
import { UsersComponent } from 'src/app/users/users.component';
import { CongregationsComponent } from 'src/app//congregations/congregations.component';
import { TagsComponent } from 'src/app/tags/tags.component';
import { ProfilesComponent } from 'src/app/profiles/profiles.component';
import { ProfileComponent } from 'src/app/profiles/profile/profile.component';
import { UserComponent } from 'src/app/users/user/user.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: 'home', component: HomeComponent, canActivate: [AuthorityGuardService]},
  {path: 'users', component: UsersComponent, canActivate: [AuthorityGuardService]},
  {path: 'user/:mode', component: UserComponent, canActivate: [AuthorityGuardService]},
  {path: 'congregations', component: CongregationsComponent, canActivate: [AuthorityGuardService]},
  {path: 'tags', component: TagsComponent, canActivate: [AuthorityGuardService]},
  {path: 'profiles', component: ProfilesComponent, canActivate: [AuthorityGuardService]},
  {path: 'profile/:mode', component: ProfileComponent, canActivate: [AuthorityGuardService]},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
