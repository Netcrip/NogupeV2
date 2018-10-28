import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from '@angular/common';

import { ClaseComponent } from './clase.component';
import { ClaseRcoutingModule } from './clase-routing.module';

@NgModule({
  imports: [
    FormsModule,
    ClaseRcoutingModule,
    ChartsModule,
    CommonModule,
    BsDropdownModule,
    ButtonsModule.forRoot()
  ],
  declarations: [ ClaseComponent ]
})
export class ClaseModule { }
