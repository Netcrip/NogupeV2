import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import {Materia} from '../interface/Materia'


@Injectable({
  providedIn: 'root'
})
export class MateriaService {

  Materiacollection: AngularFirestoreCollection<Materia>;
  Materias: Observable<Materia[]>;
  Materiasaño: Observable<Materia[]>;
  Materiacollectionadm: AngularFirestoreCollection<Materia>;
  Materiasadm: Observable<Materia[]>;

  constructor(public afs: AngularFirestore) {
    this.startmateriasadm();
   }

   start(carrera){
    this.Materiacollection = this.afs.collection<Materia>('Materias', ref => ref.where('carrera',"==",carrera).where('estado',"==","activa"));
    this.Materias = this.Materiacollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Materia;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
   }
   
   startmateriasadm(){
    this.Materiacollectionadm = this.afs.collection<Materia>('Materias', ref => ref.where('estado',"==","activa"));
    this.Materiasadm = this.Materiacollectionadm.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Materia;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
   }
   getMateriasadm() {
    return this.Materiasadm;
  }
   getMaterias() {
    return this.Materias;
  }
  eliminarmateria(materia){
      // Auth provider unlinked from account
      var Ref: AngularFirestoreDocument<any> = this.afs.collection('Materias').doc(materia);
      Ref.update({"estado":"inactiva"}).then(_ => console.log('update!'));
  }
  startmateriaaño(carrera,año){
    this.Materiacollection = this.afs.collection<Materia>('Materias', ref => ref.where('carrera',"==",carrera).where('estado',"==","activa").where("ano","==",año));
    this.Materiasaño = this.Materiacollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Materia;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  getmateriaaño(){
    return this.Materiasaño
  }
}
