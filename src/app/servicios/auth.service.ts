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




@Injectable()
export class AuthService {

  user: Observable<User>;
  
  dni_o:Observable<Dni>;
  dniCollection: AngularFirestoreDocument<Dni>;


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
////// OAuth Methods /////
linkgoogleLogin() {
  const provider = new auth.GoogleAuthProvider();
  //return this.oAuthLogin(provider);
  return firebase.auth().currentUser.linkWithPopup(provider).then(function(result) {
    if (result.credential) {
       console.log("Accounts successfully linked");
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
  const provider = new auth.FacebookAuthProvider();
  //return this.oAuthLogin(provider);
  return firebase.auth().currentUser.linkWithPopup(provider).then(function(result) {
    if (result) {
       console.log("Accounts successfully linked");
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
async googleLogin() {
  return this.afAuth.auth.signInWithPopup( new firebase.auth.GoogleAuthProvider).then(function(result){
    console.log(result);
  }).catch(function(error){
    console.log(error);
  });


}
githubLogin() {
  const provider = new auth.GithubAuthProvider();
  return this.oAuthLogin(provider);
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

twitterLogin() {
  const provider = new auth.TwitterAuthProvider();
  return this.oAuthLogin(provider);
}

private oAuthLogin(provider: any) {
  return this.afAuth.auth
    .signInWithPopup(provider)
    .then(credential => {
      //this.notify.update('Welcome to Firestarter!!!', 'success');
      return credential.user;
    })
    .catch(error => this.handleError(error));
}


//// Email/Password Auth ////
async emailSignUp(email: string, password: string, dni:string, nombre: string, avatar:string ) {
    return this.afAuth.auth
    .createUserWithEmailAndPassword(email,password)
    .then(credential => {
      //this.notify.update('Welcome new user!', 'success');
      return this.updateUserData(credential.user,dni,nombre,avatar); // if using firestore
    })
    .catch(error => this.handleError(error));
}


// documento
/*
getOnedni(dsi: string){
  this.dni_o = this.afAuth.authState.pipe(
    switchMap(dni => {
      if (this.dni_o) {
        return this.afs.doc<dni>(`Dni/${dsi}`).valueChanges()
      } else {
        return of(null)
      }
    })
  )
 }  
*/ usuariosdocu(nrodni:string): Observable <boolean> {   
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
   /*
     return true
   }else {
    // doc.data() will be undefined in this case
    return false;
}
*/
}

 docu(nrodni:string): Observable <boolean> {   
  //console.log("entro 1");
    return new Observable(observer =>{
      this.afs.collection("Dni").ref.where("Dni","==",nrodni).get().then(function(collection){
        if(!collection.empty){
          //console.log(collection.docs[0].data());
          observer.next(true);
          observer.complete;
      }else{
        //console.log(collection.docs[0].data());
        observer.next(false);
        observer.complete;
    }
    }).catch(function (error) {
      observer.error(error);
      observer.complete();
      console.log("Error getting document:", error);
   });
    });
     /*
       return true
     }else {
      // doc.data() will be undefined in this case
      return false;
  }
  */
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
private updateUserData(user: User,dni,nombre,avatar) {
  const userRef: AngularFirestoreDocument<User> = this.afs.doc(
    `users/${user.uid}`
  );
  const data: User = {
    uid: user.uid,
    email: user.email,
    dni:dni,
    displayName: nombre|| 'nameless user',
    avatarURL: avatar|| 'https://goo.gl/Fz9nrQ'
    

  };
  return userRef.set(data);
} 
}