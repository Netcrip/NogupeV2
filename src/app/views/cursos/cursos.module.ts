import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from '@angular/common';


import { CursosComponent } from './cursos.component';
import { CursosRoutingModule } from './cursos-routing.module';

@NgModule({
  imports: [
    FormsModule,
    CursosRoutingModule,
    ChartsModule,
    CommonModule,
    BsDropdownModule,
    ButtonsModule.forRoot()
  ],
  declarations: [ CursosComponent ]
})
export class CursosModule { }
