import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { Dni } from '../../interface/dni'
@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent {

  constructor(public auth: AuthService, private router: Router) {

  }

  arrayDni: Array<Dni> = [];

  // Creacion de cuenta.
  async create(email, name, password, dni) {
    this.auth.getcountclas(dni).subscribe(e => {
      this.arrayDni = e;
    })
    if (this.arrayDni.length > 0) {
      this.arrayDni.forEach(d => {
        if (d.Dni == dni.value) {
          this.auth.usuariosdocu(dni.value)
            .subscribe(succes => {
              if (succes == true) {
                this.singup(email.value, password.value, dni.value, name.value, document.querySelector<any>('input[name="optionsRadios"]:checked').value, d.cuenta);
                console.log("Registro Exitoso");
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
      console.log("DNI vacio");
    }
  }

  // Login.
  async singup(email, password, dni, name, avatar, acount) {
    await this.auth.emailSignUp(email, password, dni, name, avatar, acount);
    await this.afterSignIn();
  }

  // Lo que hace despues del logeo.
  async afterSignIn() {
    return await this.router.navigate(['nogupe/cursos']);
  }

  // Logout.
  async logout() {
    return this.router.navigate(['nogupe/']);
  }

}
