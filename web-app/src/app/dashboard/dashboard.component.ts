import { Component, OnInit } from '@angular/core';

import { CharacterService } from '../_services/character.service';
import { PC } from '../character-detail/Character';
import {AngularFireList} from "angularfire2/database";
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    constructor(
        private characterService: CharacterService,
    ) { }
    characters: Observable<any[]>;
    ngOnInit(): void {
      this.characters = this.characterService.getPCs(4);
    }
}
