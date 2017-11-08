import { Component, OnInit } from '@angular/core';

import { CharacterService } from '../_services/character.service';
import { Character } from '../_types/Character';
import {AngularFireList} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {MapService} from '../_services/map.service';
import {MonsterService} from '../_services/monster.service';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    constructor(
        private characterService: CharacterService,
        private mapService: MapService,
        private monsterService: MonsterService,
        private router: Router
    ) { }
    characters: Observable<any[]>;
    monsters: Observable<any[]>;
    maps: Observable<any[]>;

    ngOnInit(): void {
      this.characters = this.characterService.getPcObservableList(6);
      this.monsters = this.monsterService.getMonsterObservableList(4);
      this.maps = this.mapService.getMapObservableList(4);
    }

    toCharacter(name) {
      this.router.navigate(['/myCharacters/', name]);
    }

    toMap(name) {
      this.router.navigate(['/myMaps/', name]);
    }

    toMonster(name) {
      this.router.navigate(['/myMonsters/', name]);
    }
}
