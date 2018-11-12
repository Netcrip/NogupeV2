import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import {Dni} from '../../interface/dni'
@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent {

  constructor( public auth: AuthService,
    private router: Router) {
     
     
  }
  dn: Array<Dni>=[];

  async create(email, nombre,pas,pas1,dni){
        // this.singup(email.value,pas.value,dni.value,nombre.value,document.querySelector('input[name="optionsRadios"]:checked').value);
    
    this.auth.getcountclas(dni).subscribe(d => {
      this.dn = d;
    })
    if(this.dn.length>0){
      this.dn.forEach(d => {
        if(d.Dni==dni.value){
          this.auth.usuariosdocu(dni.value).subscribe(succes=> {
            if(succes==true){
                this.singup(email.value,pas.value,dni.value,nombre.value,document.querySelector<any>('input[name="optionsRadios"]:checked').value,d.cuenta);
            }
            else{
            console.log("dni repetido"); 
            } 
             });
            }
             else{
              console.log("dni Incorrecto");
        }  
    })
    }  
    else{
      console.log("dni Incorrecto");
    }
}
async singup(email,pas,dni,nombre,avatar,cuenta){
  //console.log(email, pas, dni, nombre, avatar);
  await this.auth.emailSignUp(email,pas,dni,nombre,avatar,cuenta);
  await this.afterSignIn();
}
async afterSignIn() {
  // Do after login stuff here, such router redirects, toast messages, etc.
  return await this.router.navigate(['nogupe/cursos']);
}


}
