import { Component, OnInit } from '@angular/core';

import { CharacterService } from '../_services/character.service';
import { Character } from '../_types/Character';
import {AngularFireList} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    constructor(
        private characterService: CharacterService,
        private router: Router
    ) { }
    characters: Observable<any[]>;
    ngOnInit(): void {
      this.characters = this.characterService.getPcObservableList(4);
    }

    toDetail(name) {
      this.router.navigate(['/myCharacters/', name]);
    }
}
