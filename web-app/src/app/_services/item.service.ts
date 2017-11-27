// Core
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';

// AngularFire2
import {AngularFireDatabase, AngularFireList, AngularFireObject} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';

// Authored
import {Item} from '../_types/Item';

@Injectable() // for dependency injection
export class ItemService {
  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
  ) {}

  getItemObservableList(limit?: number): Observable<any[]> {
    const uid = this.afAuth.auth.currentUser.uid;
    const path = 'users/' + uid + '/items/';
    if (limit) {
      return this.db.list(path, ref => ref.limitToFirst(limit).orderByChild('name')).valueChanges();
    } else {
      return this.db.list(path).valueChanges();
    }
  }

  getItemObservable(name: string): Observable<any> {
    const uid = this.afAuth.auth.currentUser.uid;
    const path = 'users/' + uid + '/items/' + name;
    return this.db.object(path).valueChanges();
  }

  getItemRefList(limit?: number): AngularFireList<Item[]> {
    const uid = this.afAuth.auth.currentUser.uid;
    const path = 'users/' + uid + '/items/';
    if (limit) {
      return this.db.list(path, ref => ref.limitToFirst(limit).orderByChild('name'));
    } else {
      return this.db.list(path);
    }
  }

  getItemRef(name: string): AngularFireObject<Item> {
    const uid = this.afAuth.auth.currentUser.uid;
    const path = 'users/' + uid + '/items/' + name;
    return this.db.object(path);
  }

  createItem(item: Item) {
    const uid = this.afAuth.auth.currentUser.uid;
    const path = 'users/' + uid + '/items/' + item.name;
    return this.db.object(path).set(item);
  }

  deleteItem(name: string) {
    const uid = this.afAuth.auth.currentUser.uid;
    const path = 'users/' + uid + '/items/' + name;
    return this.db.object(path).remove();
  }

  updateItem(item: Item) {
    const uid = this.afAuth.auth.currentUser.uid;
    const path = 'users/' + uid + '/items/' + item.name;
    return this.db.object(path).update(item);
  }

}
