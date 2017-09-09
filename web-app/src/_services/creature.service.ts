import { Injectable } from '@angular/core';

import { PC} from '../app/pc-detail/PC';
import {mockCharacters } from '../_data/mock-pcs';

@Injectable() // for dependency injection
export class CreatureService {
    getPCs(): Promise<PC[]> {
        return Promise.resolve(mockCharacters);
    } // get player characters for current user
    getPC(id: number): Promise<PC> {
        return this.getPCs()
            .then(PCs => PCs.find(pc => pc.id === id));
    }
}
