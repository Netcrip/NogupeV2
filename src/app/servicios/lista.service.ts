import { Injectable } from '@angular/core';
import { Cursos } from '../interface/cursos'
import { Inscriptos } from '../interface/inscriptos';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { AuthService } from './auth.service';
import { Inscripciones } from '../interface/inscripciones';

@Injectable({
  providedIn: 'root'
})
export class ListaService {
  cursosCollection: AngularFirestoreCollection<Inscripciones>;
  cursos: Observable<Inscripciones[]>;

  //
  inscriptosColection: AngularFirestoreCollection<Inscriptos>
  Inscriptos: Observable<Inscriptos[]>
  inscriptosdoc: AngularFirestoreDocument<Inscriptos>

  constructor(public afs: AngularFirestore, public auth: AuthService) {
    var uid = auth.getuid();
    this.cursosCollection = afs.collection<Inscripciones>('inscripciones', ref => ref.where('uid', "==", uid));
    this.cursos = this.cursosCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Inscripciones;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

  }

  getCursos() {
    return this.cursos;
  }

  setAlumnos(c) {
    this.inscriptosColection = this.afs.collection<Inscriptos>('cursadas/' + c + '/alumnos', ref => ref.orderBy("fecha", "asc"));
    this.Inscriptos = this.inscriptosColection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Inscriptos;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
}
