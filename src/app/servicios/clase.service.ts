import { Injectable, Input } from '@angular/core';

import {Muro} from '../interface/muro'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import {AuthService} from './auth.service'
import { Inscripciones } from '../interface/inscripciones';
import swal from 'sweetalert2';
import { Notas } from '../interface/notas';
import { Cursada } from '../interface/cursada';
import { Presentismo } from '../interface/presentismo';
import { Alumnipresente } from '../interface/alumnipresente';


@Injectable({
  providedIn: 'root'
})
export class ClasesService {
  clasCollection: AngularFirestoreCollection<Muro>;
  clases: Observable<Muro[]>;
  clasDoc: AngularFirestoreDocument<Muro>;
  inscCollection: AngularFirestoreCollection<Inscripciones>;
  inscs: Observable<Inscripciones[]>
  alcollection: AngularFirestoreCollection<Notas>;
  alumnos: Observable<Notas[]>
  claseclasesinfocollection:AngularFirestoreCollection<Cursada>;
  clasesinfo:Observable<Cursada[]>;
  listadonoascole:AngularFirestoreCollection<Notas>
  listadonotas:Observable<Notas[]>
  listadopresentescole:AngularFirestoreCollection<Presentismo>
  listadopresentes:Observable<Presentismo[]>
  alpretokecollection:AngularFirestoreCollection<Alumnipresente>
  alpretoke:Observable<Alumnipresente[]>
  listadocoleccionpresentes:AngularFirestoreCollection<Alumnipresente>
  presenteslista:Observable<Alumnipresente[]>
  flagpresentismo=0;
  public v:string;
  constructor(public afs: AngularFirestore, public auth:AuthService) {
  this.cargar();
    
  }
  cargar(){
    this.clasCollection = this.afs.collection<Muro>('cursadas/'+this.v+'/muro',ref=>ref.orderBy("fecha","asc") );
    this.clases = this.clasCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Muro;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    
  }
  cargarlumnos(p){
    this.alcollection = this.afs.collection<Notas>('cursadas/'+p+'/notas',ref=>ref.where("estado","==","activa") );
    this.alumnos = this.alcollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Notas;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  cargarpendiente(p){
    this.inscCollection = this.afs.collection<Inscripciones>('inscripciones',ref=>ref.where('cursadaid',"==",p).where("estado","==","pendiente") );
    this.inscs = this.inscCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Inscripciones;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  getClases() {
    return this.clases;
  }
  
  
  addPost(muro: Muro) {
    this.clasCollection.add(muro);
    
  }

  getpendientes(){
    return this.inscs;
  }

  eliminar(doc){
    var Ref: AngularFirestoreDocument<Inscripciones> = this.afs.collection('inscripciones').doc(doc)
    Ref.delete().then(_=>{
      swal({
        type: 'success',
        title: 'Eliminado!',
        showConfirmButton: false,
        timer: 1500
      })
    })

  }
  aceptar(doc,useruid,uname,cursada){
    var Ref: AngularFirestoreDocument<Inscripciones> = this.afs.collection('inscripciones').doc(doc);
    Ref.update({estado:'activa'}).then(_ => {
      this.crearnota(uname,useruid,cursada)
      swal({
        type: 'success',
        title: 'Aceptado!',
        showConfirmButton: false,
        timer: 1500
      })
    });
  }
  datosdeclase(id){
    this.claseclasesinfocollection = this.afs.collection<Cursada>('cursadas', ref => ref.where('cursadaid',"==",id));
    this.clasesinfo = this.claseclasesinfocollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Cursada;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  getdatoclase(){
    return this.clasesinfo;
  }
  getalunos(){
    return this.alumnos
  }
  crearnota(nom,uid,cursada){
          let id= this.afs.createId();
          let notaref: AngularFirestoreDocument <Notas> =this.afs.doc(`cursadas/`+cursada+`/notas/${id}`);
          const not:Notas= {
            notaid:id,
            nota1:"",
            nota2:"",
            notafinal:"",
            uid:uid,
            uname:nom,
            estado:"activa"
          }
          notaref.set(not);
  }
  cargarnota(nota1,nota2,nota3,curso,notaid){
    let notaref: AngularFirestoreDocument <Notas> =this.afs.doc(`cursadas/`+curso+`/notas/${notaid}`);
          notaref.update({
            nota1:nota1,
            nota2:nota2,
            notafinal:nota3,
            estado:"cargada"
          }).then(function(){
            swal({
              type: 'success',
              title: 'Notas Cargadas!',
              showConfirmButton: false,
              timer: 1500
            })
          });
  }
  generarpresentismo(cod,valido,curso){
    let id=this.afs.createId();
    let presentismoref: AngularFirestoreDocument <Presentismo> =this.afs.doc(`cursadas/`+curso+`/presentismo/${id}`);
    presentismoref.set({
      presenteid:id, 
      codigo:cod,
      valido:valido}).then(function(){
        swal({
          type: 'success',
          title: 'Token Generado Con Exito!',
          showConfirmButton: false,
          timer: 1500
        })
      });
  }
  confirmarpresentismo(curso,cod,tiempo,uid,uname){
   this.flagpresentismo=1; 
    let valcol = this.afs.collection<Presentismo>(`cursadas/`+curso+`/presentismo`, ref => ref.where('codigo',"==",cod));
    let val= valcol.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Presentismo;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    val.forEach(element => {
      if(element.length<1){
        swal({
          type: 'error',
          title: 'Confirme el Token!',
          showConfirmButton: false,
          timer: 1500
        })
        this.flagpresentismo=0;
      }
      else{
        let x=0;
        element.forEach(element => {
          if(new Date(element.valido).getTime()> new Date().getTime() && this.flagpresentismo==1){
            x=1;
            let id=this.afs.createId();
            let presentismoref: AngularFirestoreDocument <Alumnipresente> =this.afs.doc(`cursadas/`+curso+`/presentismo/`+element.presenteid+`/alumnos/${id}`);
            presentismoref.set({
              alpresenteid:id,
              uid:uid,
              uname:uname,
              dia: tiempo.getDate()+"/"+(tiempo.getMonth()+1)+"/"+tiempo.getFullYear()+" "+tiempo.getHours()+":"+tiempo.getMinutes(),
            }).then(_ =>{
              this.flagpresentismo=0;
              let aid=this.afs.createId();
              let dia=  tiempo.getDate()+"/"+(tiempo.getMonth()+1)+"/"+tiempo.getFullYear();
              let presentismoref: AngularFirestoreDocument <Alumnipresente> =this.afs.doc(`cursadas/`+curso+`/Asistencia/${aid}`);
                presentismoref.set({
                alpresenteid:id,
                uid:uid,
                uname:uname,
                dia:dia,
            }).then(function(){
              swal({
                type: 'success',
                title: 'Asistencia Generada!',
                showConfirmButton: false,
                timer: 1500
              })
            })
            });
          }
        });
        if(x==0){
          this.flagpresentismo=0;
          swal({
            type: 'error',
            title: 'Confirme el Token!',
            showConfirmButton: false,
            timer: 1500
          })
        }
      }
    });
    
  }
  startlistadonota(curso){
    this.listadonoascole = this.afs.collection<Notas>('cursadas/'+curso+'/notas',ref=>ref.where("estado","==","cargada") );
    this.listadonotas = this.listadonoascole.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Notas;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  getlistadonota(){
    return this.listadonotas;
  }

  starttodoslospresentes(curso){
    this.listadopresentescole   = this.afs.collection<Presentismo>('cursadas/'+curso+'/presentismo');
    this.listadopresentes = this.listadopresentescole.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Presentismo;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  gettodoslospresentes(){
    return this.listadopresentes;
  }
  startaltoken(curso,token){
    this.alpretokecollection   = this.afs.collection<Alumnipresente>('cursadas/'+curso+'/presentismo/'+token+'/alumnos');
    this.alpretoke = this.alpretokecollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Alumnipresente;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  getaltoken(){
    return this.alpretoke;
  }

  startlistadopresentes(curso){
    this.listadocoleccionpresentes   = this.afs.collection<Alumnipresente>('cursadas/'+curso+'/Asistencia');
    this.presenteslista = this.listadocoleccionpresentes.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Alumnipresente;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  getlistadopresente(){
    return this.presenteslista;
  }
}