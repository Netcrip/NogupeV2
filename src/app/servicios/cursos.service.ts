import { Injectable } from '@angular/core';

import {Cursos} from '../interface/cursos'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import {AuthService} from './auth.service';
import { Materia } from '../interface/Materia';
import swal from 'sweetalert2';
import { Cursada } from '../interface/cursada';
import { Dni } from '../interface/dni';
import { async } from '@angular/core/testing';
import { Inscripciones } from '../interface/inscripciones';
import $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class CursosService {
  cursosCollection: AngularFirestoreCollection<Cursos>;
  cursos: Observable<Cursos[]>;
  cursoDoc: AngularFirestoreDocument<Cursos>;
  cursosList = []
  dnisCollection: AngularFirestoreCollection<Dni>;
  dnis: Observable<Dni[]>;
  cursadasCollection:AngularFirestoreCollection<Cursada>;
  cursadas: Observable<Cursada[]>;
  InscripcionesCollection: AngularFirestoreCollection<Inscripciones>;
  inscipciones: Observable<Inscripciones[]>;
  d:Dni[]=[];
  consultaInscripcionesCollection: AngularFirestoreCollection<Inscripciones>;
  consultainscipciones: Observable<Inscripciones[]>;
  profeclasesCollection:AngularFirestoreCollection<Cursada>;
  profeclases: Observable<Cursada[]>;
  cursadasadm:Observable<Cursada[]>;
  cursadasCollectionadm:AngularFirestoreCollection<Cursada>;
  inscreditar:Observable<Inscripciones[]>;
  inscripcioncellectioneditar:AngularFirestoreCollection<Inscripciones>;


  constructor(public afs: AngularFirestore, public auth: AuthService) {
    this.start();
    this.starttodaslascursadas();
  }
  start(){
    var uid=  this.auth.getuid();
    this.InscripcionesCollection = this.afs.collection<Inscripciones>('inscripciones', ref => ref.where('uid',"==",uid));
    this.inscipciones = this.InscripcionesCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Inscripciones;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  getCursos() {
    return this.inscipciones;
  }
  addCurso(curso: Cursos) {
    console.log('NEW COURSE');
    this.cursosCollection.add(curso);
  }
  deleteCurso(curso: Cursos) {
    this.cursoDoc = this.afs.doc(`cursos/${curso.id}`);
    this.cursoDoc.delete();
  }
  updateCurso(curso: Cursos) {
    this.cursoDoc = this.afs.doc(`cursos/${curso.id}`);
    this.cursoDoc.update(curso);
  }
  altaclase(ano,carrera,materia){
    //const careraref: AngularFirestoreDocument<Materia> = this.afs.doc(`Materias/DyqR21SKtIUIvK7qVb5k`);
    let id= this.afs.createId();
    let careraref: AngularFirestoreDocument <Materia> =this.afs.doc(`Materias/${id}`);
    const data: Materia = {
      materiaid:id,
      ano: ano,
      carrera:carrera,
      materia:materia,
      estado:"activa",
    };
    careraref.set(data).then(function() {
    swal('Creado!',
    'Se creo con exito la materia!',
    'success')
  })
  .catch(function() {
    return false;
  });
  } 
  
  altacursada(fechainc,fechafin,img,materiauid,materia,dias,numerocursada,color,carrera,profesoruid,profesorname){
    //const careraref: AngularFirestoreDocument<Materia> = this.afs.doc(`Materias/DyqR21SKtIUIvK7qVb5k`);
    let id= this.afs.createId();
    let careraref: AngularFirestoreDocument <Cursada> =this.afs.doc(`cursadas/${id}`);
    const data: Cursada = {
    cursadaid : id,
    fechainc:fechainc,
    fechafin:fechafin,
    img:img,
    dias:dias,
    materiauid:materiauid,
    materia:materia,
    color:color,
    numerocursada:numerocursada,
    carrera:carrera,
    proferosname:profesorname,
    profesoruid:profesoruid,
    estado:"activa"
    };
    careraref.set(data).then(function() {
    swal('Creado!',
    'se creo con exito la Cursada!',
    'success')
  })
  .catch(function() {
    return false;
  });
  } 
  consultardni(dni){
    this.dnisCollection = this.afs.collection<Dni>('Dni', ref => ref.where('Dni',"==",dni));
    this.dnis =  this.dnisCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        setTimeout(()=>{ }, 40000)
        const data = a.payload.doc.data() as Dni;
        const id = a.payload.doc.id;
         return { id, ...data };
      }))
    );
  }
  getdni(){
    return this.dnis;
  }
  altausuario(dni,cuenta){
    //const careraref: AngularFirestoreDocument<Materia> = this.afs.doc(`Materias/DyqR21SKtIUIvK7qVb5k`);
    this.consultardni(dni);
    let x=0;
    this.dnis.subscribe( result=> { 
      if(x==0){        
        if(result.length==0){
            x=1;
            let id= this.afs.createId();
            let careraref: AngularFirestoreDocument <Cursada> =this.afs.doc(`Dni/${id}`);
            const data: Dni = {
            Dni:dni,
            cuenta:cuenta,
            estado:"activa"
            };
            careraref.set(data).then(function() {
            swal('Creado!',
            'Se cargo con exito el Usuario!',
            'success')
            }) 
          .catch(function() {
            return false;
          });
        }
        else{
          x=1;          
            if(result.length>0){
              swal('Repetido!',
              'el documento esta repetido!',
              'error')
            }  
        }
      }
      
    });

   
  } 
  starcursadas(materiaid){
    this.cursadasCollection = this.afs.collection<Cursada>('cursadas', ref => ref.where('materiauid',"==",materiaid).where("estado","==","activa"));
    this.cursadas = this.cursadasCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Cursada;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  getcursadas(  ){
    return this.cursadas;
  }
  modificarcursada(cursadaid,fini,ffin,icono,materiauid,materia,diasyhorario,numerocursada,color,carrera,profesor,profesorname){
    var Ref: AngularFirestoreDocument<any> = this.afs.collection('cursadas').doc(cursadaid);
    const data: Cursada = {
      cursadaid : cursadaid,
      fechainc:fini,
      fechafin:ffin,
      img:icono,
      materiauid:materiauid,
      materia:materia,
      color:color,
      numerocursada:numerocursada,
      carrera:carrera,
      dias:diasyhorario,
      profesoruid:profesor,
      estado:"activa"
      }
    Ref.update(data).then(_ => console.log('update!'));
  }
  eliminarcursada(cursadaid){
    // Auth provider unlinked from account
    var Ref: AngularFirestoreDocument<any> = this.afs.collection('cursadas').doc(cursadaid);
    Ref.update({"estado":"inactiva"}).then(_ => console.log('update!'));
  }
  consultarinsc(materiaid,uid){
    this.consultaInscripcionesCollection = this.afs.collection<Inscripciones>('inscripciones', ref => ref.where('materiauid',"==",materiaid).where("uid","==",uid));
    this.consultainscipciones =  this.consultaInscripcionesCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        setTimeout(()=>{ }, 40000)
        const data = a.payload.doc.data() as Inscripciones;
        const id = a.payload.doc.id;
         return { id, ...data };
      }))
    );
  }
  clasesprofesorstart(){
    var uid=  this.auth.getuid();
    this.profeclasesCollection = this.afs.collection<Cursada>('cursadas', ref => ref.where('profesoruid',"==",uid));
    this.profeclases = this.profeclasesCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Cursada;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  getclasesprofesor(){
    return this.profeclases
  }
  altainscripcion(insc:Inscripciones){
    this.consultarinsc(insc.materiauid,insc.uid);
    let x=0;
    this.consultainscipciones.subscribe( result=> { 
      if(x==0){        
        if(result.length==0){
          x=1
          let id= this.afs.createId();
          let careraref: AngularFirestoreDocument <Cursada> =this.afs.doc(`inscripciones/${id}`);
          insc.inscripcionesid=id;
          careraref.set(insc).then(function() {
            swal('Creado!',
            'Se a Inscripto con exito!',
            'success')
            }) 
          .catch(function(error) {
            return false;
          });
        }
        else{
          x=1;          
            if(result.length>0){
              swal('Espere!',
              'La Inscripcion esta creada!',
              'error')
            }  
        }
      }
    });
  }
  getcursadasadm(){
    return this.cursadasadm;
  }

  starttodaslascursadas(){
    this.cursadasCollectionadm = this.afs.collection<Cursada>('cursadas', ref => ref.where("estado","==","activa"));
    this.cursadasadm = this.cursadasCollectionadm.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Cursada;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  updatecursadas(carreracursadaid,profesoruid,profesorname,dias,img,color){
    let x=1;
    var Ref: AngularFirestoreDocument<any> = this.afs.collection('cursadas').doc(carreracursadaid);
    Ref.update({"profesoruid":profesoruid,"proferosname":profesorname,"dias":dias,"img":img,"color":color}).then(_ => 
      swal(
        'Actualizada!',
        'Cursada actualizada',
        'success'
      )
      );
      this.inscripcioncellectioneditar = this.afs.collection<Inscripciones>('inscripciones', ref => ref.where("cursadaid","==",carreracursadaid));
      this.inscreditar = this.inscripcioncellectioneditar.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Inscripciones;
        const id = a.payload.doc.id;
        return { id, ...data };
        }))
      );
      this.inscreditar.forEach(element => {
        if(x==1){
          element.forEach(element => {
            var Ref: AngularFirestoreDocument<any> = this.afs.collection('inscripciones').doc(element.inscripcionesid);
            Ref.update({"profesoruid":profesoruid,"proferosname":profesorname,"dias":dias,"img":img,"color":color})
          });
          x=0;
        }
        
      });
    
  }
  
}
