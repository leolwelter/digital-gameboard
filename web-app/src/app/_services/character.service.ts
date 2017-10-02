import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import 'rxjs/Observable';

import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';
import {PC} from '../pc-detail/PC';

@Injectable() // for dependency injection
export class CharacterService {
    constructor(private db: AngularFireDatabase,
                private afAuth: AngularFireAuth, ) {
    }


    getPCs(user: string): FirebaseListObservable<any> {
        const pcsPath = '/users/' + user + '/characters';
        return this.db.list(pcsPath);
    }

    getPC(user: string, name: string): FirebaseObjectObservable<any> {
        const pcPath = '/users/' + user + '/characters/' + name;
        return this.db.object(pcPath);
    }

    createPC(user: string, name: string) {
        const path = '/users/' + user + '/characters/' + name;
        return this.db.object(path).update({'name': name});
    }

    deletePC(user: string, name: string) {
        const path = '/users/' + user + '/characters/' + name;
        return this.db.object(path).remove();
    }

    updatePC(user: string, pc: PC) {
        const path = '/users/' + user + '/characters/' + pc.name;
        return this.db.object(path).update(pc);
    }
}
