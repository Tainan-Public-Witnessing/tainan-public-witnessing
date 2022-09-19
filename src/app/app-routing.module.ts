import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/home/home.component';
import { PersonalShiftComponent } from './personal-shift/personal-shift.component';
import { ProfileComponent } from './profile/profile.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { UserComponent } from './users/user/user.component';
import { UsersComponent } from './users/users.component';
import { Mode } from './_enums/mode.enum';
import { AuthorityService } from './_services/authority.service';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthorityService] },
  {
    path: 'personal-shift',
    component: PersonalShiftComponent,
    canActivate: [AuthorityService],
  },
  {
    path: 'shifts',
    component: ShiftsComponent,
    canActivate: [AuthorityService],
  },
  { path: 'users', component: UsersComponent, canActivate: [AuthorityService] },
  {
    path: `users/${Mode.CREATE}`,
    component: UserComponent,
    canActivate: [AuthorityService],
  },
  {
    path: 'users/:mode/:uuid',
    component: UserComponent,
    canActivate: [AuthorityService],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthorityService]
  },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
