import { Injectable } from '@angular/core';

import { PC} from '../pc-list/PC';
import {mockCharacters } from '../_data/mock-pcs';

@Injectable() // for dependency injection
export class CreatureService {
    getPCs(): Promise<PC[]> {
        return Promise.resolve(mockCharacters);
    } // get player characters for current user
}
