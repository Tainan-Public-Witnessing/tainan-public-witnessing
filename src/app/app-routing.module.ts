import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorityService } from './_services/authority.service';

import { HomeComponent } from 'src/app/home/home.component';
import { PersonalShiftComponent } from './personal-shift/personal-shift.component';
import { ShiftsComponent } from './shifts/shifts.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthorityService] },
  { path: 'personal-shift', component: PersonalShiftComponent, canActivate: [AuthorityService] },
  {path: 'shifts', component: ShiftsComponent, canActivate: [AuthorityService]},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
