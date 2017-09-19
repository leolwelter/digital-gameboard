// Angular Core
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

// AngularFire2 and Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import * as firebase from 'firebase/app';

// Authored
import {PC} from '../pc-detail/PC';


/*
    PlayerService is meant only to:
    Retrieve PC data by user (either all or one)
    Save changes to PC data
    Delete a PC
    Do not exit this scope by applying authentication checks, etc.
    Assume validation is applied outside of the service
 */

@Injectable()
export class PlayerService {
    constructor(
        private afAuth: AngularFireAuth,
        private db: AngularFireDatabase,
        private http: Http,
    ) { }

    // getPCsByUser(): FirebaseListObservable<PC> {
    //     //return list of Observables as promise
    // }
}
