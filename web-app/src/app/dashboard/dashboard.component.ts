import { Component, OnInit } from '@angular/core';

import { CharacterService } from '../_services/character.service';
import { PC } from '../pc-detail/PC';
import {FirebaseListObservable} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
    constructor(
        private characterService: CharacterService,
        private afAuth: AngularFireAuth
    ) { }

    myCharacters: FirebaseListObservable<any>;

    ngOnInit(): void {
        const uid = this.afAuth.auth.currentUser.uid;
        this.myCharacters = this.characterService.getPCs(uid);
    }
}
