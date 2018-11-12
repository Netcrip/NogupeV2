import { Component, OnInit, OnChanges} from '@angular/core';
import { Router,NavigationEnd } from '@angular/router';
import {CursosService} from '../../servicios/cursos.service';
import {Cursos} from '../../interface/cursos';
import { AuthService } from '../../servicios/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import * as $ from 'jquery';
import { ListadoprofesorService } from '../../servicios/listadoprofesor.service';
import { User } from '../../interface/user';
import { Materia } from '../../interface/Materia';
import { MateriaService } from '../../servicios/materia.service';
import { forEach } from '@angular/router/src/utils/collection';
import swal from 'sweetalert2';
import { Cursada } from '../../interface/cursada';
import { Inscripciones } from '../../interface/inscripciones';


@Component({
  templateUrl: 'cursos.component.html',
  styleUrls: ['./cursos.component.scss']
})
export class CursosComponent implements OnInit, OnChanges{
    
    cursos: Inscripciones[];
    editState: boolean = false;
    cursoToEdit: Cursos;
    profes: User[];
    materias: Materia[];
    materiasao: Materia[];
    materia:Materia;
    cursadas: Cursada[];
    inscripciones: Inscripciones;
    cursosacargo:Cursada[];
    nombre:string;

    carreras = ["Licenciatura en Comercio Internacional",
    "Licenciatura en Turismo", "Licenciatura en Seguridad e Higiene",    
    "Licenciatura en Gestión Aeroportuaria",
    "Licenciatura en  Logística",
    "Tecnicatura Universitaria en Desarrollo de Software"];
    tipousuario=["alumno","profesor","admin"]
    
    color=[{nombre:"Naranja",val:"orange"},{nombre:"rojo",val:"red"},{nombre:"azul",val:"blue"},{nombre:"blanco",val:"white"},{nombre:"violeta",val:"purple"},{nombre:"verde",val:"green"}]
    submitted = false;
    onSubmit() { this.submitted = true; } 

    constructor(private cursoService: CursosService, private router: Router,public auth: AuthService,private afs: AngularFirestore,private profesores:ListadoprofesorService, private mat:MateriaService) {
      this.router.routeReuseStrategy.shouldReuseRoute = function(){
        return false;
     }

     }
    ngOnInit() {
      this.cursoService.start();
      this.profesores.start();
      this.cursoService.getCursos().subscribe(cursos => {
        this.cursos = cursos;
      });
      this.profesores.getProfes().subscribe(profe => {
        this.profes = profe;
      });
      this.cargarclasesprofesor()
      
    }
    ngOnChanges(){
      this.cursoService.start();
      this.cursoService.getCursos().subscribe(cursos => {
        this.cursos = cursos;
      });
      this.cargarclasesprofesor()
    }
    cargarclasesprofesor(){
      this.cursoService.clasesprofesorstart();
      this.cursoService.getclasesprofesor().subscribe(clase =>{
        this.cursosacargo=clase
      })
    }
    cargarcursada(){
      this.cursadas.forEach(element => {
        if(element.cursadaid==$('#bccursadas').find(":selected").val()){
          $("#bcfinicio").val(element.fechainc)
          $("#bcffin").val(element.fechafin)
          $("#bcprofesor option[value="+element.profesoruid+"]").attr("selected", true);
          $("input[value="+element.img+"]").prop("checked", true);
          $("#bccolormateria option[value="+element.color+"]").attr("selected", true);

          $("#bcfinicio").prop( "disabled", false );
          $("#bcffin").prop( "disabled", false );
          $("#bcprofesor").prop( "disabled", false );
          $("input[type=radio]").prop( "disabled", false );
          $("#bccolormateria").prop( "disabled", false );

          $("#bcmodificar").show();
          $("#bceliminar").show();

        }
        
      });
    }
    bcmodificar(){
      var fini=$("#bcfinicio").val();
      var ffin=$("#bcffin").val();
      var carrera =$('#bccarrera').find(":selected").text();
      var numerocursada=$('#bccursadas').find(":selected").text();
      var cursadaid=$('#bccursadas').val();
      var materia=$('#bccmateria').find(":selected").text();
      var materiauid =$('#bccmateria').find(":selected").val();
      var profesor =$('#bcprofesor').find(":selected").val();
      var icono =$("input[name=bccolorradio]:checked").val();
      var color =$('#bccolormateria').find(":selected").val();
      swal({
        title: 'Estas Seguro?',
        text: "Modificara los datos de la cursada",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Modificar!'
      }).then((result) => {
        if (result.value) {
        this.cursoService.modificarcursada(cursadaid,fini,ffin,icono,materiauid,materia,numerocursada,color,carrera,profesor)
          $("#bcformcursada").trigger('reset');
          $("#buscarcursada .close").click();
          $("#bcfinicio").prop( "disabled", true );
          $("#bcffin").prop( "disabled", true );
          $("#bcprofesor").prop( "disabled", true );
          $("input[type=radio]").prop( "disabled", true );
          $("#bccolormateria").prop( "disabled", true );
        swal(
          'Modificado!',
          'Se a modificado la cursada',
          'success'
        )
      }
    })
    }
    bceliminarmateria(){
      swal({
        title: 'Estas Seguro?',
        text: "No podra revertir la eliminacion",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Eliminar!'
      }).then((result) => {
        if (result.value) {
          this.cursoService.eliminarcursada($('#bccursadas').find(":selected").val());
          $("#bcformcursada").trigger('reset');
          $("#buscarcursada .close").click();
          $("#bcfinicio").prop( "disabled", true );
          $("#bcffin").prop( "disabled", true );
          $("#bcprofesor").prop( "disabled", true );
          $("input[type=radio]").prop( "disabled", true );
          $("#bccolormateria").prop( "disabled", true );
          
          swal(
            'Eliminado!',
            'No podra crear mas cursadas de esta materia',
            'success'
          )
        }
      })
      
    }
    cargarmaterias(){
      this.mat.start($('#carreras').find(":selected").text());
      this.mat.getMaterias().subscribe(materia=>{
        this.materias=materia;
      });
    }
    carreracursada(){
      this.mat.start($('#bccarrera').find(":selected").text());
      this.mat.getMaterias().subscribe(materia=>{
        this.materias=materia;
      });
    }
    materiacursada(){
      this.materias.forEach(element=>{
        if(element.materia==$("#bccmateria").find(":selected").text()){
          $("#bcaño").val(element.año);
          this.cursoService.starcursadas(element.materiaid)
          this.cursoService.getcursadas().subscribe(cursada =>{
           this.cursadas=cursada;
         })
          
        }
      })
    }
    datosmateria(){
      this.materias.forEach(element=>{
        if(element.materiaid==$("#materias").find(":selected").val()){
          $("#año").val(element.año)
          $("#año").prop('disabled', false);
          $("#eliminar").show()
        }
      })
    }
    altamateria(){
      var a= $("#ano").val();//document.getElementById("año").value;
      var carrera =$('#carrera').find(":selected").text()//document.getElementById("carrera").options[document.getElementById("carrera").selectedIndex].text;
      var materia =$("#materia").val(); //document.getElementById("materia").value
      this.cursoService.altaclase(a,carrera,materia)
      $("#crearmateria .close").click()
    }
    altaclase(){
      var fini=$("#finicio").val();
      var ffin=$("#ffin").val();
      var carrera =$('#carreramat').find(":selected").text();
      var numerocursada=$('#cursadan').val();
      var materia=$('#mat').find(":selected").text();
      var materiauid =$('#mat').find(":selected").val();
      var profesor =$('#profesor').find(":selected").val();
      var icono =$("input[name=colorradio]:checked").val();
      var color =$('#colormateria').find(":selected").val();
      this.cursoService.altacursada(fini,ffin,icono,materiauid,materia,numerocursada,color,carrera,profesor)
      $("#Crearclase .close").click()
      $("#fcrearclase").trigger('reset');
    }
    Altausuario(){
      var dni=$("#documento").val();
      var cuenta =$('#usuariotipo').find(":selected").text();
      this.cursoService.altausuario(dni,cuenta)
      $("#Altausuario .close").click()
    }

    irclase(s){
     console.log(s)
     this.router.navigate(['nogupe/clase/',s])
    }

    eliminarmateria(){
      swal({
        title: 'Estas Seguro?',
        text: "No podra revertir la eliminacion",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Eliminar!'
      }).then((result) => {
        if (result.value) {
          this.mat.eliminarmateria($("#materias").find(":selected").val());
          
          swal(
            'Eliminado!',
            'No podra crear mas cursadas de esta materia',
            'success'
          )
        }
      })
      this.materias=[];
      $("#formeliminar").trigger('reset');
      $("#buscarmateria .close").click();
  }

  imaterias(){
    this.mat.startmateriaaño($("#icarrera").find(":selected").text(),$("#iano").find(":selected").val())
    this.mat.getmateriaaño().subscribe(materia=>{
     this.materiasao=materia;
   });
   }

  
   icursadas(){
    this.cursoService.starcursadas($("#imateria").find(":selected").val())
    this.cursoService.getcursadas().subscribe(cursada =>{
    this.cursadas=cursada;
    });
  }
  inscripcioncursada(){
    this.cursadas.forEach(element => {
      if(element.cursadaid==$("#icursada").find(":selected").val()){
        this.auth.user.subscribe(u=>{
        this.inscripciones = {
        carrera:element.carrera,
        color: element.color,
        cursadaid:element.cursadaid,
        fechafin:element.fechafin,
        fechainc:element.fechainc,
        img:element.img,
        materia:element.materia,
        materiauid:element.materiauid,
        numerocursada:element.numerocursada,
        uid: this.auth.getuid(),
        uname:u.displayName,
        estado:"pendiente"
      }})
      } 
    });
    this.cursoService.altainscripcion(this.inscripciones)
  }

}