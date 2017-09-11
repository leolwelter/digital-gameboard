import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { PC } from '../app/pc-detail/PC';


@Injectable() // for dependency injection
export class CreatureService {
    constructor(private http: Http) { }

    getPCs(): Promise<PC[]> {
        // TODO Implement FirebaseData service
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
