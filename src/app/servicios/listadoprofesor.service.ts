import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import {User} from '../interface/user'


@Injectable({
  providedIn: 'root'
})
export class ListadoprofesorService {
  Profecollection: AngularFirestoreCollection<User>;
  profesores: Observable<User[]>;

  constructor(public afs: AngularFirestore) {
    this.start();
   }

   start(){
    this.Profecollection = this.afs.collection<User>('users', ref => ref.where('cuenta',"==","profesor"));
    this.profesores = this.Profecollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as User;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
   }
   getProfes() {
    return this.profesores;
  }
}
