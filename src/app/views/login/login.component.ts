import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
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
   console.log("entro")
    await this.auth.emailLogin(email.value,pas.value);
    return await this.afterSignIn();
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
    

}
