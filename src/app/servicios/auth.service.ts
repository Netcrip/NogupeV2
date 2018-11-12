import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Observable, of, observable, from } from 'rxjs';
import { switchMap} from 'rxjs/operators';
import * as firebase from 'firebase/app';
import {User} from '../interface/user';
import {Dni} from '../interface/dni';
import { map } from 'rxjs/operators';


@Injectable()
export class AuthService {

  user: Observable<User>;
  cuenta:string;
  dni_o:Observable<Dni>;
  //dniCollection: AngularFirestoreDocument<Dni>;

  dniCollection: AngularFirestoreCollection<Dni>;
  dni: Observable<Dni[]>;
  dniDoc: AngularFirestoreDocument<Dni>;


  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
  ) {

      //// Get auth data, then get firestore user document || null
      this.user = this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
          } else {
            return of(null)
          }
        })
      )
      
      
    }
    
    ////
    
getuid(){
  return this.afAuth.auth.currentUser.uid;
}


////// link a cuenta social/////
linkgoogle() {
  const provider = new auth.GoogleAuthProvider();
  let a =this.afAuth.auth.currentUser.uid
  var Ref: AngularFirestoreDocument<any> = this.afs.collection('users').doc(a);
  return firebase.auth().currentUser.linkWithPopup(provider).then(function(result) {
    if (result.credential) {  
      Ref.update({"google":"link"}).then(_ => console.log('update!'));
      //var credential = result.credential;
      //var user = result.user;
      // ...
    }
  }).catch(function(error) {
    console.log(error);
  });;
}
linkface() {
  //return this.afAuth.auth.signInWithPopup( new firebase.auth.GoogleAuthProvider);
  let a =this.afAuth.auth.currentUser.uid
  const provider = new auth.FacebookAuthProvider();
  var Ref: AngularFirestoreDocument<any> = this.afs.collection('users').doc(a);
  //return this.oAuthLogin(provider);
  return firebase.auth().currentUser.linkWithPopup(provider).then(function(result) {
    if (result.credential) {

      Ref.update({"facebook":"link"}).then(_ => console.log('update!'));
      //var credential = result.credential;
      //var user = result.user;
      // ...
    }
    else{
      console.log("se encuentra vinculado");
    }
  }).catch(function(error) {
   console.log(error);
  });;
}

// unlink cuentas sociales
unLinkgoogle(){
  const provider = new auth.GoogleAuthProvider();
  let a =this.afAuth.auth.currentUser.uid

  firebase.auth().currentUser.unlink(provider.providerId).then(_ =>  {
    // Auth provider unlinked from account
    var Ref: AngularFirestoreDocument<any> = this.afs.collection('users').doc(a);
    Ref.update({"google":"unlink"}).then(_ => console.log('update!'));
  
  }).catch(function(error) {
    // An error happened
  });

}

unLinkfacebook(){
  const provider = new auth.FacebookAuthProvider();
  let a =this.afAuth.auth.currentUser.uid
  //return this.oAuthLogin(provider);
  firebase.auth().currentUser.unlink(provider.providerId).then(_ =>  {
    // Auth provider unlinked from account
    
    var Ref: AngularFirestoreDocument<any> = this.afs.collection('users').doc(a);
    Ref.update({"facebook":"unlink"}).then(_ => console.log('update!'));
  
  }).catch(function(error) {
    // An error happened
  });

}
//login-----------------------------------------------------------------------------------------------------------------------------------
async googleLogin() {
  return this.afAuth.auth.signInWithPopup( new firebase.auth.GoogleAuthProvider).then(function(result){
    console.log(result);
  }).catch(function(error){
    console.log(error);
  });


}
async facebookLogin() {
  const provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    //var token = result.credential.accessToken;
    // The signed-in user info.
    //var user = result.user;
    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}

//// Email/Password Auth ////
async emailSignUp(email: string, password: string, dni:string, nombre: string, avatar:string,cuenta :string ) {
    return this.afAuth.auth
    .createUserWithEmailAndPassword(email,password)
    .then(credential => {
      //this.notify.update('Welcome new user!', 'success');
      return this.updateUserData(credential.user,dni,nombre,avatar,cuenta); // if using firestore
    })
    .catch(error => this.handleError(error));
}


usuariosdocu(nrodni:string): Observable <boolean> {   
  //console.log("entro 1");
  return new Observable(observer =>{
    this.afs.collection("users").ref.where("dni","==",nrodni).get().then(function(collection){
      if(collection.empty){
        //console.log(collection.docs[0].data());
        observer.next(true);
        observer.complete;
    }else{
      observer.next(false);
      observer.complete;
  }
  }).catch(function (error) {
    observer.error(error);
    observer.complete();
    console.log("Error getting document:", error);
 });
  });
}


getcountclas(a){
  this.dniCollection = this.afs.collection<Dni>('Dni',ref=>ref.where('Dni','==',a.value) );
    this.dni = this.dniCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Dni;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

  return this.dni;
}
//logine email

emailLogin(email: string, password: string) {
  return this.afAuth.auth
    .signInWithEmailAndPassword(email, password)
    /*.then(credential => {
     // this.notify.update('Welcome back!', 'success');
      return this.updateUserData(credential.user);
    })
    .catch(error => this.handleError(error));*/
}

// Sends email allowing user to reset password
resetPassword(email: string) {
  const fbAuth = auth();

  return fbAuth
    .sendPasswordResetEmail(email)
    //.then(() => this.notify.update('Password update email sent', 'info'))
    .catch(error => this.handleError(error));
}


signOut() {
  this.afAuth.auth.signOut().then(() => {
    this.router.navigate(['']);
  });
}

// If error, console log and notify user
private handleError(error: Error) {
  console.error(error);
  //this.notify.update(error.message, 'error');
}


// Sets user data to firestore after succesful login
private updateUserData(user: User,dni,nombre,avatar,cuenta) {
  const userRef: AngularFirestoreDocument<User> = this.afs.doc(
    `users/${user.uid}`
  );
  const data: User = {
    uid: user.uid,
    email: user.email,
    dni:dni,
    displayName: nombre|| 'nameless user',
    avatarURL: avatar|| 'https://goo.gl/Fz9nrQ',
    facebook: 'unlink',
    google: 'unlink',
    cuenta: cuenta

  };
  return userRef.set(data);
} 
}