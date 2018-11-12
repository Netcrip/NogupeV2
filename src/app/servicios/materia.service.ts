import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Materia } from '../interface/Materia'


@Injectable({
  providedIn: 'root'
})
export class MateriaService {

  Materiacollection: AngularFirestoreCollection<Materia>;
  Materias: Observable<Materia[]>;
  Materiasaño: Observable<Materia[]>;

  constructor(public afs: AngularFirestore) {

  }

  start(carrera) {
    this.Materiacollection = this.afs.collection<Materia>('Materias', ref => ref.where('carrera', "==", carrera).where('estado', "==", "activa"));
    this.Materias = this.Materiacollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Materia;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  getMaterias() {
    return this.Materias;
  }
  eliminarmateria(materia) {
    // Auth provider unlinked from account
    var Ref: AngularFirestoreDocument<any> = this.afs.collection('Materias').doc(materia);
    Ref.update({ "estado": "inactiva" }).then(_ => console.log('update!'));
  }
  startmateriaaño(carrera, año) {
    this.Materiacollection = this.afs.collection<Materia>('Materias', ref => ref.where('carrera', "==", carrera).where('estado', "==", "activa").where("año", "==", año));
    this.Materiasaño = this.Materiacollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Materia;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  getmateriaaño() {
    return this.Materiasaño
  }
}
