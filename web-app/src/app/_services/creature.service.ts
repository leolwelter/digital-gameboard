import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { PC } from '../pc-detail/PC';

// MOCK DATA
import {mockCharacters} from '../_data/mock-pcs';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';

@Injectable() // for dependency injection
export class CreatureService {
    constructor(
        private http: Http,
        private db: AngularFireDatabase
    ) { }

    getPCs(): Promise<PC[]> {
        return Promise.resolve(mockCharacters); // TODO Implement FirebaseData service
    }


    getPC(id: number): Promise<PC> {
        return this.getPCs()
            .then(PCs =>
                PCs.find(pc => pc.id === id)
            );
    }

    private logError(e: any): Promise<any> {
        console.error('Whoops!', e);
        return Promise.reject(e.message || e);
    }
}
