import { Injectable } from '@angular/core';

import {Cursos} from '../interface/cursos'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CursosService {
  cursosCollection: AngularFirestoreCollection<Cursos>;
  cursos: Observable<Cursos[]>;
  cursoDoc: AngularFirestoreDocument<Cursos>;
  cursosList = []


  constructor(public afs: AngularFirestore, public auth: AuthService) {
    this.start();
  }
  start(){
    var uid=  this.auth.getuid();
    this.cursosCollection = this.afs.collection<Cursos>('inscripciones', ref => ref.where('userid',"==",uid));
    this.cursos = this.cursosCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Cursos;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  getCursos() {
    return this.cursos;
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
}
