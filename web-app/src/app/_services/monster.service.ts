// Core
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';

// AngularFire2
import {AngularFireDatabase, AngularFireList, AngularFireObject} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';

// Authored
import {Monster} from '../_types/Monster';

@Injectable() // for dependency injection
export class MonsterService {
  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
  ) {}

  getMonsterObservableList(limit?: number): Observable<any[]> {
    const uid = this.afAuth.auth.currentUser.uid;
    const path = 'users/' + uid + '/monsters/';
    if (limit) {
      return this.db.list(path, ref => ref.limitToFirst(limit).orderByChild('name')).valueChanges();
    } else {
      return this.db.list(path).valueChanges();
    }
  }

  getMonsterObservable(name: string): Observable<any> {
    const uid = this.afAuth.auth.currentUser.uid;
    const path = 'users/' + uid + '/monsters/' + name;
    return this.db.object(path).valueChanges();
  }

  getMonsterRefList(limit?: number): AngularFireList<Monster[]> {
    const uid = this.afAuth.auth.currentUser.uid;
    const path = 'users/' + uid + '/monsters/';
    if (limit) {
      return this.db.list(path, ref => ref.limitToFirst(limit).orderByChild('name'));
    } else {
      return this.db.list(path);
    }
  }

  getMonsterRef(name: string): AngularFireObject<Monster> {
    const uid = this.afAuth.auth.currentUser.uid;
    const path = 'users/' + uid + '/monsters/' + name;
    return this.db.object(path);
  }

  createMonster(monster: Monster) {
    const uid = this.afAuth.auth.currentUser.uid;
    const path = 'users/' + uid + '/monsters/' + monster.name;
    return this.db.object(path).set(monster);
  }

  deleteMonster(name: string) {
    const uid = this.afAuth.auth.currentUser.uid;
    const path = 'users/' + uid + '/monsters/' + name;
    return this.db.object(path).remove();
  }

  updateMonster(monster: Monster) {
    const uid = this.afAuth.auth.currentUser.uid;
    const path = 'users/' + uid + '/monsters/' + monster.name;
    return this.db.object(path).update(monster);
  }

}
