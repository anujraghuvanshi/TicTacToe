import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})


export class FirebaseService {

  user: Observable<firebase.User>;
  constructor(private firebaseAuth: AngularFireAuth, public db: AngularFirestore, private fireDB: AngularFireDatabase) {
    this.user = firebaseAuth.authState;
  }

  createUser(email: string, password: string) {
    return this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        return value;
      })
      .catch(err => {
        return err;
      });
  }

  login(email: string, password: string) {
    return this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        return value;
      })
      .catch(err => {
        return err;
      });
  }

  getResults() {
    // var userEmail = localStorage.getItem('user_email')
    // // return this.db.collection('results',ref => ref.where('email', '>=', userEmail))
    // //   .snapshotChanges()

    //   // return this.db.collection('results', ref => ref.where('email', '==', userEmail))
    //   return this.db.collection('results').afs;

  }

  saveResult(status) {

    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const dateTime = date + ' ' + time;
    const userEmail = localStorage.getItem('user_email');

    if (!userEmail) { return []; }

    return this.db.collection('results').add({
      email: userEmail,
      status,
      time: dateTime,
    });
  }

  getAllresults() {
    const listRef = this.db.collection('results', ref => ref.where('email', '==', localStorage.getItem('user_email'))).valueChanges();
    return listRef;
  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut();
  }

  doGoogleLogin(){
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.firebaseAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      }, err => {
        reject(err);
      })
    })
  }

}
