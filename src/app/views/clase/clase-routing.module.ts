import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { ClaseComponent } from './clase.component';

const routes: Routes = [
  {
    path: '',
    component: ClaseComponent,
    data: {
      title: 'cursos'
    } 
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaseRcoutingModule {}
