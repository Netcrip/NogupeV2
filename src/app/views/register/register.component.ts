import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { Dni } from '../../interface/dni'
@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent {

  constructor(public auth: AuthService,
    private router: Router) {


  }
  dn: Array<Dni> = [];

  async create(email, nombre, pas, pas1, dni) {
    // this.singup(email.value,pas.value,dni.value,nombre.value,document.querySelector('input[name="optionsRadios"]:checked').value);
    this.auth.getcountclas(dni).subscribe(d => {
      this.dn = d;
    })
    if (this.dn.length > 0) {
      this.dn.forEach(d => {
        if (d.Dni == dni.value) {
          this.auth.usuariosdocu(dni.value).subscribe(succes => {
            if (succes == true) {
              this.singup(email.value, pas.value, dni.value, nombre.value, document.querySelector<any>('input[name="optionsRadios"]:checked').value, d.cuenta);
            }
            else {
              console.log("DNI Repetido");
            }
          });
        }
        else {
          console.log("DNI Incorrecto");
        }
      })
    }
    else {
      console.log("DNI Incorrecto");
    }
  }

  // Logeo.
  async singup(email, pas, dni, nombre, avatar, cuenta) {
    await this.auth.emailSignUp(email, pas, dni, nombre, avatar, cuenta);
    await this.afterSignIn();
  }

  // Lo que hace despues del logeo.
  async afterSignIn() {
    return await this.router.navigate(['nogupe/cursos']);
  }

  // Volver al login.
  async back(){
    return this.router.navigate(['nogupe/']);
  }

}
