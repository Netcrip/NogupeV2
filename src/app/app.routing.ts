import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// auth guard
import { AuthGuard } from './servicios/auth.guard';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';


export const routes: Routes = [
  //{ path: 'clase', component: DefaultLayoutComponent, canActivate: [AuthGuard] },
  
  { path: '500', component: P500Component, data: { title: 'Page 500' } },
  { path: '', component: LoginComponent, data: { title: 'Login Page' }},
  { path: 'registro', component: RegisterComponent, data: { title: 'Register Page'} },
  { path: 'nogupe', component: DefaultLayoutComponent, data: { title: 'Nogupe'},
   children: [ { path: 'cursos', loadChildren: './views/cursos/cursos.module#CursosModule' },
      { path: 'dashboard',loadChildren: './views/dashboard/dashboard.module#DashboardModule'},
      { path: 'clase/:id',loadChildren: './views/clase/clase.module#ClaseModule'} 

    ]
    , canActivate: [AuthGuard]},
  { path: '**', component: P404Component,  data: { title: 'Page 404' } }
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
