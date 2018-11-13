import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
//import { PassThrough } from 'stream';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  constructor(public auth: AuthService, private router: Router) {
    if (auth.user) {
      this.router.navigate(['nogupe/cursos'])
    }
  }

  ngOnInit() {
    if (this.auth.getuid) {
      return this.router.navigate(['nogupe/cursos'])
    }
  }

  //Inicio de Sesión Redes Sociales.
  async signInWithGoogle() {
    await this.auth.googleLogin();
    return await this.afterSignIn();
  }

  async signInWithFacebook() {
    await this.auth.facebookLogin();
    await this.afterSignIn();
  }

  //Inicio de sesión.
  async login(email, pas) {
    console.log("entro")
    await this.auth.emailLogin(email.value, pas.value);
    return await this.afterSignIn();
  }

  //Cerrar Sesión.
  singout() {
    this.auth.signOut();
  }

  //Después de iniciar sesión aquí, redirecciones de enrutador, mensajes, etc.
  async afterSignIn() {
    return await this.router.navigate(['nogupe/cursos']);
  }

  //Ruteo de registro.
  routerRegister() {
    this.router.navigate(['registro'])
  }

}
