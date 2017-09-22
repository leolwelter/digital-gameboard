// Angular assets
import { Component } from '@angular/core';
import { OnInit} from '@angular/core';
import { Router } from '@angular/router';

// AngularFire assets
import {FirebaseListObservable} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';
import {FirebaseObjectObservable} from 'angularfire2/database';

// Authored assets
import { PC } from '../pc-detail/PC';
import { CharacterService } from '../_services/character.service';

@Component({
    selector: 'pc-list',
    templateUrl: './pc-list.component.html',
    styleUrls: ['./pc-list.component.css'],
})
export class PCListComponent implements OnInit {
    constructor(
        private characterService: CharacterService,
        private router: Router,
        private afAuth: AngularFireAuth
    ) { }

    currentPC: PC;
    myCharacters: FirebaseListObservable<any>;

    onSelect(character: PC): void {
        this.currentPC = character;
    }
    ngOnInit(): void {
        this.getPCs();
    }
    getPCs(): void {
        const uid = this.afAuth.auth.currentUser.uid;
        this.myCharacters = this.characterService.getPCs(uid);
    }
    gotoDetail(): void {
        this.router.navigate(['/myPCs', this.currentPC.name]);
    }
}
