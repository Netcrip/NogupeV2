import { Component, OnInit, AfterContentChecked } from '@angular/core';
import {ClasesService} from '../../servicios/clase.service';
import {Muro} from '../../interface/muro';
import { AuthService } from '../../servicios/auth.service';
import {ActivatedRoute} from '@angular/router';
import { CursosService } from '../../servicios/cursos.service';
import { Inscripciones } from '../../interface/inscripciones';
import swal from 'sweetalert2';
import { Notas } from '../../interface/notas';
import { Observable } from 'rxjs';
import { Cursada } from '../../interface/cursada';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import $ from 'jquery';
import { getTime } from 'ngx-bootstrap/chronos/utils/date-getters';


@Component({
  templateUrl: './clase.component.html'
})

export class ClaseComponent implements OnInit {
  clases: Muro[];
  mensaje:Muro;
  nombreclase;
  pendientes: Inscripciones[];
  alumnos: Notas[];
  datosclase:Cursada[]
  tiempo=["15","30","60","120"]
  s;
  constructor(private claseService: ClasesService,public auth: AuthService, private route:ActivatedRoute,private cur:CursosService
      ) { 
       
      }

  ngOnInit() {
    this.s =  this.route.snapshot.paramMap.get('id');
    this.claseService.v=this.s;
    this.cur.start();
    this.clase()

    this.claseService.cargar();
       this.claseService.cargarpendiente(this.route.snapshot.paramMap.get('id'))
    this.claseService.getClases().subscribe(clases => {
    this.clases = clases;
    this.claseService.getpendientes().subscribe(pen=>{
      this.pendientes=pen;
    })
    this.clase();
    });
    this.claseService.cargarlumnos(this.route.snapshot.paramMap.get('id'))
    this.claseService.getalunos().subscribe(clases => {
    this.alumnos = clases;
    });
  }

  clase(){
    this.claseService.datosdeclase(this.route.snapshot.paramMap.get('id'))
    this.claseService.getdatoclase().subscribe(cl=>{
      this.datosclase=cl
    });
   
  }
  cargarnota(nota1,nota2,nota3,uname,useruid,notaid){
    if(nota1>10||nota2>10||nota3>10||nota1<0||nota2<0||nota3<0||nota1==''||nota2==''||nota3==''){
      swal('la nota tiene que ser entre 0 y 10')
    }
    else{
      this.claseService.cargarnota(nota1,nota2,nota3,this.route.snapshot.paramMap.get('id'),notaid)
    }
    
  }
  post(nom,txt){
    
    var d=this.formattedDate()
    this.mensaje={fecha:d,nombre:nom,texto:txt.value}

    this.claseService.addPost(this.mensaje);
    txt.value="";
  }
  notaexistente(){
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
  aceptar(inscid,useruid,uname){
    this.claseService.aceptar(inscid,useruid,uname,this.route.snapshot.paramMap.get('id'))
  }

  eliminar(inscid){
    swal({
      title: 'Estas Seguro?',
      text: "Tu alumno no podra ingresar a la clase!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, no es Alumno mío!'
    }).then((result) => {
      if (result.value) {
       this.claseService.eliminar(inscid)
      }
    })
  }
  validtime(seg) {
    let l = new Date;
    let d = new Date(l.getTime()+seg*1000)
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

  Generarcodigo(){
    let valid =this.validtime($('#segundos').find(":selected").val());
    console.log(valid)
    this.claseService.generarpresentismo($("#codigo").val(),valid,this.route.snapshot.paramMap.get('id'))
    $("#generartoken .close").click()
    $("#presente").trigger('reset');
  }
  confirmarasistencia(uid,uname){
    let t=this.formattedDate();
    this.claseService.confirmarpresentismo(this.route.snapshot.paramMap.get('id'),$("#acodigo").val(),t,uid,uname);
    $("#apresente .close").click()
    $("#afpresente").trigger('reset');
  }
  
}
