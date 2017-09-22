import { Component, OnInit } from '@angular/core';

import { CharacterService } from '../_services/character.service';
import { PC } from '../pc-detail/PC';
import {FirebaseListObservable} from "angularfire2/database";

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
    constructor(private characterService: CharacterService) { }

    myCharacters: FirebaseListObservable<any>;

    ngOnInit(): void {
        console.log('Getting characters');
        this.myCharacters = this.characterService.getPCs();
    }
}
