import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import {NgModule } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule, } from '@angular/material/icon';
import { MatToolbarModule, MatSidenavModule,  MatListModule } from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';



@NgModule({
  imports: [MatCardModule, MatProgressBarModule, MatAutocompleteModule, MatToolbarModule, MatSidenavModule,  MatListModule, MatIconModule,  MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule],
  exports: [MatCardModule, MatProgressBarModule, MatAutocompleteModule, MatToolbarModule, MatSidenavModule,  MatListModule, MatIconModule,  MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule],
})
export class MaterialComponetnModule { }
