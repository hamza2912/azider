import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { DB_COLLECTIONS } from '../common/constants/db-collections';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFireDatabase) { }

  getAdminUsers() {
    return this.db.object(DB_COLLECTIONS.adminUsers).snapshotChanges();
  }

  getHomePage() {
    return this.db.object(DB_COLLECTIONS.homePage).snapshotChanges();
  }
  
  
}
