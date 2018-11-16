import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { $ } from 'jquery';
import { PatternValidator } from '@angular/forms';
import swal from 'sweetalert2';
//import { PassThrough } from 'stream';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent { 
  constructor( public auth: AuthService,
              private router: Router) {
                if(auth.user){
                  this.router.navigate(['nogupe/cursos'])
                }
               }
ngOnInit() {
  if(this.auth.getuid){
    return  this.router.navigate(['nogupe/cursos'])
  }
  
}

  async signInWithGoogle() {
    await this.auth.googleLogin();
    return await this.afterSignIn();
  }

  async signInWithFacebook() {
    await this.auth.facebookLogin();
    await this.afterSignIn();
  }


 async login(email,pas){
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i
    if(!pattern.test(email.value)){
      swal({
        type: 'error',
        title: 'email incorrecto',
        toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 2000
      });
    }else if(pas.value.length<6){
      swal({
        type: 'error',
        title: 'revise contraseña',
        toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 2000
      });
    }
    else{
      await this.auth.emailLogin(email.value,pas.value);
      return await this.afterSignIn();
    }    
  }
  ////
  singout(){
    this.auth.signOut();
  }
  //
 
  /// Shared
  async afterSignIn() {
    // Do after login stuff here, such router redirects, toast messages, etc.
    return await this.router.navigate(['nogupe/cursos']);
  }

  //otra

  irregistro(){
    this.router.navigate(['registro'])
  }
    
  async recuperar(){
    const {value: email} = await swal({
      title: 'Ya falta menos, no desesperes',
      input: 'email',
      inputPlaceholder: 'Por favor ingresa tu email'
    })
    
    if (email) {
      this.auth.resetPassword(email)
      swal({
        type: 'success',
        title: 'Listo!, revisa tu correo!',
        toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 2000
      });
    }
  }
}
