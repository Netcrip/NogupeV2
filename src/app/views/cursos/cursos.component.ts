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
    materiasadm:Materia[];
    cursadasadm:Cursada[];
    
    carreras = ["Licenciatura en Comercio Internacional",
    "Licenciatura en Turismo", "Licenciatura en Seguridad e Higiene",    
    "Licenciatura en Gestión Aeroportuaria",
    "Licenciatura en  Logística",
    "Tecnicatura en Desarrollo de Software"];
    tipousuario=["alumno","profesor","admin"]
    dias=["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
    horarios=["08:00-12:00","08:00-10:00","10:00-12:00","13:00-17:00","13:00-15:00","15:00-17:00","18:00-22:00","18:00-20:00","20:00-22:00"]
    
    color=[{nombre:"Naranja",val:"orange"},{nombre:"Rojo",val:"red"},{nombre:"Azul",val:"blue"},{nombre:"Celeste",val:"bg-primary"},{nombre:"Violeta",val:"purple"},{nombre:"Verde",val:"green"}]
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
      this.getcursadasadm();
      this.getmaterias();
      
    }
    ngOnChanges(){
      this.cursoService.start();
      this.cursoService.getCursos().subscribe(cursos => {
        this.cursos = cursos;
      });
      this.cargarclasesprofesor()
      this.getcursadasadm();
      this.getmaterias();
    }
    cargarclasesprofesor(){
      this.cursoService.clasesprofesorstart();
      this.cursoService.getclasesprofesor().subscribe(clase =>{
        this.cursosacargo=clase
      })
    }
    reset(){
      $('#imateria').prop('selectedIndex',0);
      $('#icursada ').prop('selectedIndex',0);
    }


    agregarhorario(){
      var dia= $('#dias').find(":selected").val();
      var horario=$('#horario').find(":selected").val();
      if(dia!="" && horario!=""){
        $("#diastext").val($("#diastext").val()+dia+" "+horario+" /-/ ")
        var dia= $('#dias').find(":selected").attr("disabled","disabled");;
        $('#dias').prop("selectedIndex",0)
        $('#horario').prop("selectedIndex",0)
      }
    }
    cargarcursada(){
      this.cursadas.forEach(element => {
        if(element.numerocursada==$('#bccursadas').find(":selected").val()){
          $("#bcfinicio").val(element.fechainc)
          $("#bcffin").val(element.fechafin)
          $("#bcprofesor option[value="+element.profesoruid+"]").attr("selected", true);
          $("input[value="+element.img+"]").prop("checked", true);
          $("#bccolormateria option[value="+element.color+"]").attr("selected", true);
          $("#diastextmodificar").val(element.dias)

          $("#bcfinicio").prop( "disabled", false );
          $("#bcffin").prop( "disabled", false );
          $("#bcprofesor").prop( "disabled", false );
          $("input[type=radio]").prop( "disabled", false );
          $("#bccolormateria").prop( "disabled", false );
          $("#diasmodificar").prop( "disabled", false );
          $("#horariomodificar").prop( "disabled", false );
          $("#bcmodificar").show();
          $("#bceliminar").show();

        }
        else{
          swal({
            type: 'error',
            title: 'Cuidado!',
            text:"El numero de cursada esta repetido",
            showConfirmButton: false,
            timer: 1500
          })
        }
        
      });
    }
    borrarhorariomodificar(){
      $("#diastextmodificar").val("");
    }
    agregarhorariomodificar(){
      var dia= $('#diasmodificar').find(":selected").val();
      var horario=$('#horariomodificar').find(":selected").val();
      if(dia!="" && horario!=""){
        $("#diastextmodificar").val($("#diastextmodificar").val()+dia+" "+horario+" /-/ ")
        var dia= $('#dias').find(":selected").attr("disabled","disabled");;
        $('#diasmodificar').prop("selectedIndex",0)
        $('#horariomodificar').prop("selectedIndex",0)
      }
      
    }
    borrarhorario(){
      $("#diastext").val("");
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
      var diasyhorario =$('#diastextmodificar').val();
      if(diasyhorario!=""){
        swal({
          title: 'Estas Seguro?',
          text: "Modificara los datos de la cursada",
          type: 'warning',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Modificar'
        }).then((result) => {
          if (result.value) {
          //this.cursoService.modificarcursada(cursadaid,fini,ffin,icono,materiauid,materia,diasyhorario,numerocursada,color,carrera,profesor)
            $("#bcformcursada").trigger('reset');
            $("#buscarcursada .close").click();
            $("#bcfinicio").prop( "disabled", true );
            $("#bcffin").prop( "disabled", true );
            $("#bcprofesor").prop( "disabled", true );
            $("input[type=radio]").prop( "disabled", true );
            $("#bccolormateria").prop( "disabled", true );
          swal(
            'Modificado!',
            'Se ha modificado la cursada.',
            'success'
          )
        }
      })
      }
      else{
        swal({
          type: 'error',
          title: 'Error',
          text:"El dia de cursada no puede estar vacio.",
          showConfirmButton: false,
          timer: 1500
        })

      }      
    }
    bceliminarmateria(){
      swal({
        title: 'Estas Seguro?',
        text: "No podra revertir la operación.",
        type: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Eliminar'
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
            'No podra crear más cursadas de esta materia.',
            'success'
          )
        }
      })
      $("#bcmodificar").hide();
      $("#bceliminar").hide();
      $("#bcformcursada").trigger('reset');
      $("#buscarcursada .close").click();
      
    }
    cargarmaterias(){
      this.mat.start($('#carreras').find(":selected").text());
      this.mat.getMaterias().subscribe(materia=>{
        this.materias=materia;
      });
    }
    cargarmateriascur(){
      this.mat.start($('#carreramat').find(":selected").text());
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
      /*this.materias.forEach(element=>{
        if(element.materia==$("#bccmateria").find(":selected").text()){
          $("#bcaño").val(element.año);
          this.cursoService.starcursadas(element.materiaid)
          this.cursoService.getcursadas().subscribe(cursada =>{
           this.cursadas=cursada;
         })
          
        }
      })*/
      this.materias.forEach(element=>{
        if(element.materiaid==$("#bccmateria").find(":selected").val()){
          $("#bcaño").val(element.ano);
        }
      })
      this.cursoService.starcursadas($("#bccmateria").find(":selected").val())
      this.cursoService.getcursadas().subscribe(cursada =>{
      this.cursadas=cursada;
    })
    }
    datosmateria(){
      this.materias.forEach(element=>{
        if(element.materiaid==$("#materiase").find(":selected").val()){
          $("#año").val(element.ano)
          //$("#año").prop('disabled', false);
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
      let x=1;
      var fini=$("#finicio").val();
      var ffin=$("#ffin").val();
      var carrera =$('#carreramat').val();
      var numerocursada=$('#cursadan').val();
      var materia=$('#mat').val();
      var materiauid =$('#matid').val();
      var profesor =$('#profesor').find(":selected").val();
      var icono =$("input[name=editarimgradio]:checked").val();
      var color =$('#colormateriaalta').find(":selected").val();
      var profesorname =$('#profesor').find(":selected").text();
      var dias=$('#diastext').val();
      if(dias==""){
        swal({
          type: 'error',
          title: 'Error',
          text:"El dia de cursada no puede estar vacio.",
          showConfirmButton: false,
          timer: 1500
        })
      }
      else{
        this.cursadasadm.forEach(element => {
          if(element.numerocursada==numerocursada && x==1){
            x=0
            swal({
              type: 'error',
              title: 'Cursada repetida',
              text:"El numer de cursada se encuentra usado",
              showConfirmButton: false,
              timer: 1500
            })
          }
        })
        if(x==1){
          console.log("entro en crear")
          x=0
          this.cursoService.altacursada(fini,ffin,icono,materiauid,materia,dias,numerocursada,color,carrera,profesor,profesorname)
          $("#Crearclase .close").click()
          $("#fcrearclase").trigger('reset');
        }
    
    }
      
  }
    Altausuario(){
      var dni=$("#documento").val();
      var cuenta =$('#usuariotipo').find(":selected").text();
      this.cursoService.altausuario(dni,cuenta)
      $("#Altausuario .close").click()
    }

    irclase(s){
     this.router.navigate(['nogupe/clase/',s])
    }

    /*eliminarmateria(){   
      let materia=$("#materiase").find(":selected").val();
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
         this.mat.eliminarmateria(materia);
          
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
      $("#eliminar").hide();
      
  }
*/
  habilitarmodificarmateria(){
    $("#btnadmeditarmateria").prop( "disabled", false );
  }
  cargardatoscursadanuevoadm(carrera,materia,materiauid){
    $("#carreramat").val(carrera)
    $("#mat").val(materia)
    $("#matid").val(materiauid)

  }
  imaterias(){
    this.reset();
    this.mat.startmateriaaño($("#icarrera").find(":selected").text(),$("#iano").find(":selected").val())
    this.mat.getmateriaaño().subscribe(materia=>{
     this.materiasao=materia;
   });
   }
   imaterias1(){
    $("#iano").prop('selectedIndex',0);
    $("#imateria").prop('selectedIndex',0);
    $("#icursada").prop('selectedIndex',0);
    
    
    this.materiasao=[];
    this.cursadas=[];
   }

   getmaterias(){
     this.mat.startmateriasadm();
     this.mat.getMateriasadm().subscribe(materias=>{
      this.materiasadm=materias;
     })
     
   
   }
   getcursadasadm(){
     this.cursoService.starttodaslascursadas();
    this.cursoService.getcursadasadm().subscribe(cursadas=>{
      this.cursadasadm=cursadas;
    })
    
   }
  
   icursadas(){
    this.cursoService.starcursadas($("#imateria").find(":selected").val())
    this.cursoService.getcursadas().subscribe(cursada =>{
    this.cursadas=cursada;
    });
  }
  inscripcioncursada(){
    let c=1;
    this.cursadas.forEach(element => {
      if(element.cursadaid==$("#icursada").find(":selected").val() && c==1){
        this.auth.user.subscribe(u=>{
        this.inscripciones = {
        carrera:element.carrera,
        color: element.color,
        cursadaid:element.cursadaid,
        fechafin:element.fechafin,
        fechainc:element.fechainc,
        img:element.img,
        dias:element.dias,
        materia:element.materia,
        materiauid:element.materiauid,
        numerocursada:element.numerocursada,
        uid: this.auth.getuid(),
        uname:u.displayName,
        estado:"pendiente"
      }
      this.cursoService.altainscripcion(this.inscripciones)})
      c=0;
      } 
    });

  }
  cerrarmodal(){
    $(".close").click();
    $(".form").trigger('reset');
    $(".eliminar").hide();
  }
  eliminarmateria($mat){   
    let materia=$mat;
    swal({
      title: 'Estas Seguro?',
      text: "No podra revertir la operación.",
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar'
    }).then((result) => {
      if (result.value) {
       this.mat.eliminarmateria(materia);
        
        swal(
          'Eliminado!',
          'No podra crear más cursadas de esta materia.',
          'success'
        )
      }
    })
    
}
eliminarcursada($cursada){
  swal({
    title: 'Estas Seguro?',
    text: "Cerrara la cursada impidiendo nuevas inscripciones.",
    type: 'warning',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Eliminar'
  }).then((result) => {
    if (result.value) {
      this.cursoService.eliminarcursada($cursada);          
      swal(
        'Eliminado!',
        'Cursada cerrada',
        'success'
      )
    }
  })
  
}
cargareditar(cursadaid,
  fechainc, fechafin,
  img,
  materia,
  numerocursada,
  dias,
  carrera,
  color,
  profesoruid){
  $("#cursadaidr").val(cursadaid)
  $("#cursadanr").val(numerocursada);
  $("#carreareditare").val(carrera)
  $("#matditarr").val(materia)
  $("#finicior").val(fechainc)
  $("#ffinr").val(fechafin)
  $("#profesorr option[value='"+profesoruid+"']").attr("selected", "selected");
  $("#diastextr").val(dias);
  $("input[name=editarimgradio][value='"+img+"']").prop("checked",true);
  $("#colormateriar option[value='"+color+"']").attr("selected", "selected");
}
editarcursadaadm(){
  var carreracursadaid=$("#cursadaidr").val()
  var profesoruid= $("#profesorr").find(":selected").val();
  var profesorname= $("#profesorr").find(":selected").text();
  var dias= $("#diastextr").val();
  var img= $("input[name=editarimgradio]:checked").val();
  var color= $("#colormateriar").find(":selected").val();
  if(dias==""){
    swal(
      'Error!',
      'Asigne día y horario de cursada.',
      'error'
    )
  }
  else{
    this.cursoService.updatecursadas(carreracursadaid,profesoruid,profesorname,dias,img,color);
    this.cerrarmodal();
  }
  

}

agregarhorarior(){
  var dia= $('#diasr').find(":selected").val();
  var horario=$('#horarior').find(":selected").val();
  if(dia!="" && horario!=""){
    $("#diastextr").val($("#diastextr").val()+dia+" "+horario+" /-/ ")
    $('#diasr').prop("selectedIndex",0)
    $('#horarior').prop("selectedIndex",0)
    this.habilitarmodificarmateria()
  }
}
borrarhorarior(){
  $("#diastextr").val("");
}
}