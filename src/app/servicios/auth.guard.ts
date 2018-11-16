import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.user.pipe(
      take(1),
      map(user => !!user),
      tap(loggedIn => {
        if (!loggedIn) {
          this.router.navigate(['']).then(_=>{
            this.error();
          });
        }
        else{
          this.succes();
        }
      })
    );
  }
  succes(){
    swal({
      type: 'success',
      title: 'Gracias Por volver',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  } 
  error(){
    swal({
      type: 'error',
      title: 'Ups.! algo salio mal prueba entrar de nuevo',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  } 
}
