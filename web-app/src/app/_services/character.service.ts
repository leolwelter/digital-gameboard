import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';


import {PC} from '../character-detail/Character';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';

@Injectable() // for dependency injection
export class CharacterService {
    constructor(
      private db: AngularFireDatabase,
      private afAuth: AngularFireAuth,
    ) {}

    getPCs(limit?: number): Observable<any[]> {
      const uid = this.afAuth.auth.currentUser.uid;
      const path = 'users/' + uid + '/characters/';
      if (limit) {
        return this.db.list(path, ref => ref.limitToFirst(limit).orderByChild('name')).valueChanges();
      } else {
        return this.db.list(path).valueChanges();
      }
    }

    getPC(name: string): Observable<any> {
      const uid = this.afAuth.auth.currentUser.uid;
      const path = 'users/' + uid + '/characters/' + name;
      return this.db.object(path).valueChanges();
    }

    createPC(pc: PC) {
      const uid = this.afAuth.auth.currentUser.uid;
      const path = 'users/' + uid + '/characters/' + pc.name;
      return this.db.object(path).set(pc);
    }

    deletePC(name: string) {
      const uid = this.afAuth.auth.currentUser.uid;
      const path = 'users/' + uid + '/characters/' + name;
      return this.db.object(path).remove();
    }

    updatePC(pc: PC) {
      const uid = this.afAuth.auth.currentUser.uid;
      const path = 'users/' + uid + '/characters/' + pc.name;
      return this.db.object(path).update(pc);
    }

}
