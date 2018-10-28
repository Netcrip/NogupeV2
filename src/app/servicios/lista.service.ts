import { Injectable } from '@angular/core';
import {Cursos} from '../interface/cursos'
import {Inscriptos} from '../interface/inscriptos';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ListaService {
  cursosCollection: AngularFirestoreCollection<Cursos>;
  cursos: Observable<Cursos[]>;
  cursoDoc: AngularFirestoreDocument<Cursos>;
  cursosList = []
  //
  inscriptosColection: AngularFirestoreCollection<Inscriptos>
  Inscriptos: Observable<Inscriptos[]>
  inscriptosdoc:AngularFirestoreDocument<Inscriptos>

  constructor(public afs: AngularFirestore, public auth: AuthService) {
    var uid=  auth.getuid();
    this.cursosCollection = afs.collection<Cursos>('inscripciones', ref => ref.where('userid',"==",uid));
    this.cursos = this.cursosCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Cursos;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    
    
  }
  setAlumnos(c) {
    this.inscriptosColection=this.afs.collection<Inscriptos>('cursadas/'+c+'/alumnos',ref=>ref.orderBy("fecha","asc") );
    this.Inscriptos = this.inscriptosColection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Inscriptos;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
}
