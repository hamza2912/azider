import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { IUser } from '../common/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

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
    return this.afAuth.authState;
  }
}
