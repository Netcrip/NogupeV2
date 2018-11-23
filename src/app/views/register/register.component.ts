import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import {Dni} from '../../interface/dni'
import swal from 'sweetalert2';
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
    event.preventDefault();
        var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i
        if(nombre.value.length<6 || nombre.value.length>40){
          swal({
            type: 'error',
            title: 'Revise Nomnbre',
            text:"Longitud minima 6 maxima 40",
            toast: true,
            position: 'center',
            showConfirmButton: false,
            timer: 2000
          });
        }
        else if(!pattern.test(email.value)){
          swal({
            type: 'error',
            title: 'email incorrecto',
            toast: true,
            position: 'center',
            showConfirmButton: false,
            timer: 2000
          });
        }else if(pas.value.length<6 || pas.value!=pas1.value){
          swal({
            type: 'error',
            title: 'revise contraseña',
            text:"Longitud minima 6 maxima 12",
            toast: true,
            position: 'center',
            showConfirmButton: false,
            timer: 2000
          });
        }
        else if(dni.value.length<6 || dni.value.length>12){
          swal({
            type: 'error',
            title: 'Documento Incorrecto',
            toast: true,
            position: 'center',
            showConfirmButton: false,
            timer: 2000
          });
        }
        else{
          this.auth.getcountclas(dni).subscribe(d => {           
          if(d.length>0){
             d.forEach(d => {
              if(d.Dni==dni.value){
                this.auth.usuariosdocu(dni.value).subscribe(succes=> {
                  if(succes==true){
                      this.singup(email.value,pas.value,dni.value,nombre.value,document.querySelector<any>('input[name="optionsRadios"]:checked').value,d.cuenta);
                  }
                  else{
                    swal({
                      type: 'error',
                      title: 'Documento Repetido',
                      toast: true,
                      position: 'center',
                      showConfirmButton: false,
                      timer: 2000
                    }); 
                  } 
                  });
                  }
                  else{
                    swal({
                      type: 'error',
                      title: 'Documento Incorrecto',
                      toast: true,
                      position: 'center',
                      showConfirmButton: false,
                      timer: 2000
                    });
              }  
          })
          }  
          else{
            swal({
              type: 'error',
              title: 'Documento Incorrecto',
              toast: true,
              position: 'center',
              showConfirmButton: false,
              timer: 2000
            });
          }
        })
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

cancel(){
  this.router.navigate(['']);
}
}
