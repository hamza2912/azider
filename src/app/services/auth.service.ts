import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import { IUser } from '../common/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userdId: string;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) { }

  login() {
    return this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  afterLogin() {
    return this.afAuth.auth.getRedirectResult();
  }

  logout() {
    return this.afAuth.auth.signOut();
  }

  getLoggedInUser(): IUser {
    const user = localStorage.getItem('user');
    return user && JSON.parse(user);
  }

  getFireBaseLoggedInUser() {
    this.afAuth.authState.subscribe((auth)=> {
      if (auth) this.userdId = auth.uid
    });
    return this.afAuth.authState;
  }

  processPayment(token:any, amount){
    const payment = {token, amount}
    return this.db.list('/payments/${this.userId}').push(payment)
  }
}
