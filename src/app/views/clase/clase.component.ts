import { Component, OnInit } from '@angular/core';
import {ClasesService} from '../../servicios/clase.service';
import {Muro} from '../../interface/muro';
import { AuthService } from '../../servicios/auth.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  templateUrl: './clase.component.html'
})

export class ClaseComponent implements OnInit {
  clases: Muro[];
  mensaje:Muro;
  s;
  constructor(private claseService: ClasesService,public auth: AuthService, private route:ActivatedRoute
      ) { }

  ngOnInit() {
     this.s =  this.route.snapshot.paramMap.get('id');
    this.claseService.v=this.s;
    this.claseService.cargar();
    this.claseService.getClases().subscribe(clases => {
    this.clases = clases;
    });
  }
 
  clase(){
    
  }
  post(nom,txt){
    
    var d=this.formattedDate()
    this.mensaje={fecha:d,nombre:nom,texto:txt.value}

    this.claseService.addPost(this.mensaje);
    txt.value="";
  }



  formattedDate(d = new Date) {
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());
    let hora =String(d.getHours());
    let min = String(d.getMinutes());
    let sec = String(d.getSeconds());
  
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if(sec.length<2) sec='0'+sec;
    if(min.length<2) min='0'+min;
    if(hora.length<2) hora='0'+hora;
  
    return `${day}/${month}/${year} ${hora}:${min}:${sec}`;
  }

}
