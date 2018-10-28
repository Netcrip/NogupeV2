import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { CursosComponent } from './cursos.component';


const routes: Routes = [
  {
    path: '',
    component: CursosComponent,
    data: {
      title: 'cursos'
    } 
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CursosRoutingModule {}
