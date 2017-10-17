import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';


import {Character} from '../character-detail/Character';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';

@Injectable() // for dependency injection
export class CharacterService {
    constructor(
      private db: AngularFireDatabase,
      private afAuth: AngularFireAuth,
    ) {}

    getPcObservableList(limit?: number): Observable<any[]> {
      const uid = this.afAuth.auth.currentUser.uid;
      const path = 'users/' + uid + '/characters/';
      if (limit) {
        return this.db.list(path, ref => ref.limitToFirst(limit).orderByChild('name')).valueChanges();
      } else {
        return this.db.list(path).valueChanges();
      }
    }

    getPcObservable(name: string): Observable<any> {
      const uid = this.afAuth.auth.currentUser.uid;
      const path = 'users/' + uid + '/characters/' + name;
      return this.db.object(path).valueChanges();
    }

    getPcRefList(limit?: number): AngularFireList<any[]> {
      const uid = this.afAuth.auth.currentUser.uid;
      const path = 'users/' + uid + '/characters/';
      if (limit) {
        return this.db.list(path, ref => ref.limitToFirst(limit).orderByChild('name'));
      } else {
        return this.db.list(path);
      }
    }

    getPcRef(name: string): AngularFireObject<any> {
      const uid = this.afAuth.auth.currentUser.uid;
      const path = 'users/' + uid + '/characters/' + name;
      return this.db.object(path);
    }

    createPC(pc: Character) {
      const uid = this.afAuth.auth.currentUser.uid;
      const path = 'users/' + uid + '/characters/' + pc.name;
      return this.db.object(path).set(pc);
    }

    deletePC(name: string) {
      const uid = this.afAuth.auth.currentUser.uid;
      const path = 'users/' + uid + '/characters/' + name;
      return this.db.object(path).remove();
    }

    updatePC(pc: Character) {
      const uid = this.afAuth.auth.currentUser.uid;
      const path = 'users/' + uid + '/characters/' + pc.name;
      return this.db.object(path).update(pc);
    }

}
