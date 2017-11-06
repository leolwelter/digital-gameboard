// Core
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';

// AngularFire2
import {AngularFireDatabase, AngularFireList, AngularFireObject} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';

// Authored
import {GameMap} from '../_types/GameMap';
import {Cell} from '../_types/Cell';

@Injectable() // for dependency injection
export class MapService {
  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
  ) {}


  /*
  GameMap methods
   */
  createMap(map: GameMap) {
    const uid = this.afAuth.auth.currentUser.uid;
    const path = 'users/' + uid + '/maps/' + map.name;
    map.resetMap();
    return this.db.object(path).set(map);
  }

  deleteMap(name: string) {
    const uid = this.afAuth.auth.currentUser.uid;
    const path = 'users/' + uid + '/maps/' + name;
    return this.db.object(path).remove();
  }

  getMapRef(name: string): AngularFireObject<GameMap> {
    const uid = this.afAuth.auth.currentUser.uid;
    const path = 'users/' + uid + '/maps/' + name;
    return this.db.object(path);
  }

  getMapObservable(): Observable<any> {
    const uid = this.afAuth.auth.currentUser.uid;
    const path = 'users/' + uid + '/maps/' + name;
    return this.db.object(path).valueChanges();
  }

  getMapObservableList(limit?: number): Observable<any[]> {
    const uid = this.afAuth.auth.currentUser.uid;
    const path = 'users/' + uid + '/maps/';
    if (limit) {
      return this.db.list(path, ref => ref.limitToFirst(limit).orderByChild('name')).valueChanges();
    } else {
      return this.db.list(path).valueChanges();
    }
  }


  /*
  Cell methods
   */
  getCellsObservableList(map: string): Observable<any[]> {
    const uid = this.afAuth.auth.currentUser.uid;
    const path = 'users/' + uid + '/maps/' + map + '/cells/';
    return this.db.list(path).valueChanges();
  }

  getCellsRef(map: string): AngularFireList<Cell> {
    const uid = this.afAuth.auth.currentUser.uid;
    const path = 'users/' + uid + '/maps/' + map + '/cells/';
    return this.db.list(path, ref => {
      return ref.orderByChild('order');
    });
  }


  /*
  Terrain methods
   */
  getPublicTerrainObservableList(): Observable<any[]> {
    const path = 'terrain/';
    return this.db.list(path).valueChanges();
  }
  getPublicTerrainReferenceList(): AngularFireList<any> {
    const path = 'terrain/';
    return this.db.list(path);
  }
  getPublicTerrainObservable(name: string): Observable<any> {
    const path = 'terrain/' + name;
    return this.db.object(path).valueChanges();
  }
  getPublicTerrainRef(name: string): AngularFireObject<any> {
    const path = 'terrain' + name;
    return this.db.object(path);
  }
}
