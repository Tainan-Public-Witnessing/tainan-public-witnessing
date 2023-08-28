import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { routes } from './routes';
import { AuthorityService } from './_services/authority.service';

const appRoutes: Routes = routes
  .filter((route) => 'path' in route)
  .map<Route>((route) => ({
    path: route.path,
    component: route.component,
    canActivate: [AuthorityService],
  }))
  .concat([
    {
      path: '**',
      redirectTo: 'home',
    },
  ]);

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
