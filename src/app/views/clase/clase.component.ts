import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { ClasesService } from '../../servicios/clase.service';
import { Muro } from '../../interface/muro';
import { AuthService } from '../../servicios/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CursosService } from '../../servicios/cursos.service';
import { Inscripciones } from '../../interface/inscripciones';
import swal from 'sweetalert2';
import { Notas } from '../../interface/notas';
import { Observable } from 'rxjs';
import { Cursada } from '../../interface/cursada';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import $ from 'jquery';
import { getTime } from 'ngx-bootstrap/chronos/utils/date-getters';
import { Alumnipresente } from '../../interface/alumnipresente';
import { Presentismo } from '../../interface/presentismo';


@Component({
  templateUrl: './clase.component.html'
})

export class ClaseComponent implements OnInit {
  clases: Muro[];
  mensaje: Muro;
  nombreclase;
  pendientes: Inscripciones[];
  alumnos: Notas[];
  datosclase: Cursada[]
  tiempo = ["15", "30", "60", "120"]
  notas: Notas[];
  prom: number = 0;
  lospresentes: Presentismo[];
  alpresente: Alumnipresente[];
  listadopresentes: Alumnipresente[];
  al
  s;
  constructor(private claseService: ClasesService, public auth: AuthService, private route: ActivatedRoute, private cur: CursosService
  ) {

  }

  ngOnInit() {
    this.s = this.route.snapshot.paramMap.get('id');
    this.claseService.v = this.s;
    this.cur.start();
    this.clase()

    this.claseService.cargar();
    this.claseService.cargarpendiente(this.route.snapshot.paramMap.get('id'))
    this.claseService.getClases().subscribe(clases => {
      this.clases = clases;
      this.claseService.getpendientes().subscribe(pen => {
        this.pendientes = pen;
      })
      this.clase();
    });
    this.claseService.cargarlumnos(this.route.snapshot.paramMap.get('id'))
    this.claseService.getalunos().subscribe(clases => {
      this.alumnos = clases;
    });
    this.claseService.startlistadonota(this.route.snapshot.paramMap.get('id'));
    this.cargarnotas()
    this.claseService.starttodoslospresentes(this.route.snapshot.paramMap.get('id'))
    this.todoslospresentes();
    this.claseService.startlistadopresentes(this.route.snapshot.paramMap.get('id'))
    this.listadoasistencia();


  }

  clase() {
    this.claseService.datosdeclase(this.route.snapshot.paramMap.get('id'))
    this.claseService.getdatoclase().subscribe(cl => {
      this.datosclase = cl
    });

  }
  cargarnota(nota1, nota2, nota3, notaid) {
    if (nota1 > 10 || nota2 > 10 || nota3 > 10 || nota1 < 0 || nota2 < 0 || nota3 < 0 || nota1 == '' || nota2 == '' || nota3 == '') {
      swal('La nota debe ser de 1-10.')
    }
    if (nota1 >= 7 && nota2 >= 7 && nota3 >= 7) {
      this.claseService.cargarnota(nota1, nota2, nota3, this.route.snapshot.paramMap.get('id'), notaid)
    }
    else if (nota1 >= 7 && nota2 >= 4 && nota3 >= 4 && nota3 < 7 || nota2 >= 7 && nota1 >= 4 && nota1 >= 4 && nota3 < 7) {
      this.claseService.cargarnota(nota1, nota2, nota3, this.route.snapshot.paramMap.get('id'), notaid)
    }
    else if (nota1 >= 4 && nota2 >= 4 && nota3 >= 4 && nota3 < 7) {
      this.claseService.cargarnota(nota1, nota2, nota3, this.route.snapshot.paramMap.get('id'), notaid)
    }
    else if (nota1 < 4 && nota2 < 4 && nota3 < 4 || nota1 < 4 && nota2 > 4 && nota3 < 4 || nota1 > 4 && nota2 < 4 && nota3 < 4) {
      this.claseService.cargarnota(nota1, nota2, nota3, this.route.snapshot.paramMap.get('id'), notaid)
    }
    else {
      swal('Revise los criterios de calificación.')
      nota3 = "";
    }

  }
  post(nom, txt) {

    var d = this.formattedDate()
    this.mensaje = { fecha: d, nombre: nom, texto: txt.value }

    this.claseService.addPost(this.mensaje);
    txt.value = "";
  }
  notaexistente() {
  }

  formattedDate(d = new Date) {
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());
    let hora = String(d.getHours());
    let min = String(d.getMinutes());
    let sec = String(d.getSeconds());

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (sec.length < 2) sec = '0' + sec;
    if (min.length < 2) min = '0' + min;
    if (hora.length < 2) hora = '0' + hora;

    return `${day}/${month}/${year} ${hora}:${min}:${sec}`;
  }
  aceptar(inscid, useruid, uname) {
    this.claseService.aceptar(inscid, useruid, uname, this.route.snapshot.paramMap.get('id'))
  }

  eliminar(inscid) {
    swal({
      title: 'Estas Seguro?',
      text: "El alumno no podra ingresar a la clase.",
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.value) {
        this.claseService.eliminar(inscid)
      }
    })
  }
  validtime(seg) {
    let l = new Date;
    let d = new Date(l.getTime() + seg * 1000)
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());
    let hora = String(d.getHours());
    let min = String(d.getMinutes());
    let sec = String(d.getSeconds());

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (sec.length < 2) sec = '0' + sec;
    if (min.length < 2) min = '0' + min;
    if (hora.length < 2) hora = '0' + hora;

    return `${year}/${month}/${day} ${hora}:${min}:${sec}`;
  }

  Generarcodigo() {
    let valid = this.validtime($('#segundos').find(":selected").val());
    console.log(valid)
    this.claseService.generarpresentismo($("#codigo").val(), valid, this.route.snapshot.paramMap.get('id'))
    $("#presente .close").click()
    $("#generartoken").trigger('reset');
  }
  confirmarasistencia(uid, uname) {
    let t = new Date();
    this.claseService.confirmarpresentismo(this.route.snapshot.paramMap.get('id'), $("#acodigo").val(), t, uid, uname);
    $("#apresente .close").click()
    $("#afpresente").trigger('reset');
  }
  cargarnotas() {
    this.claseService.getlistadonota().subscribe(notas => {
      this.notas = notas;
    })
  }

  promedio() {
    let x = 0;
    let pro = 0;
    $(".notafinal").each(function () {
      x = x + 1;
      pro = pro + parseInt($(this).html());
    })
    this.prom = pro / x;
  }
  todoslospresentes() {
    this.claseService.gettodoslospresentes().subscribe(a => {
      this.lospresentes = a
    })
  }

  cargaralumnostoken(id) {
    this.claseService.startaltoken(this.route.snapshot.paramMap.get('id'), id)
    this.alumnotoke()
  }
  alumnotoke() {
    this.claseService.getaltoken().subscribe(d => {
      this.alpresente = d
    })
  }

  listadoasistencia() {
    this.claseService.getlistadopresente().subscribe(presentes => {
      this.listadopresentes = presentes;
    })

  }
  cerrarmodal() {
    $(".close").click()
    $(".form").trigger('reset');
  }

}
