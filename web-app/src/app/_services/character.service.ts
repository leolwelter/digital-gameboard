import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';

@Injectable() // for dependency injection
export class CharacterService {
    constructor(
        private db: AngularFireDatabase
    ) { }


    getPCs(user: string): FirebaseListObservable<any> {
        const pcsPath = '/users/' + user + '/characters';
        return this.db.list(pcsPath);
    }

    getPC(user: string, name: string): FirebaseObjectObservable<any> {
        const pcPath = '/users/' + user + '/characters/' + name;
        return this.db.object(pcPath);
    }
}
