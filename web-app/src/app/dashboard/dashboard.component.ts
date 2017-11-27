import { Component, OnInit } from '@angular/core';

import { CharacterService } from '../_services/character.service';
import { Character } from '../_types/Character';
import {AngularFireList} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {MapService} from '../_services/map.service';
import {MonsterService} from '../_services/monster.service';
import {ItemService} from '../_services/item.service';

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
        private itemService: ItemService,
        private router: Router
    ) { }
    characters: Observable<any[]>;
    monsters: Observable<any[]>;
    maps: Observable<any[]>;
    items: Observable<any[]>;

    ngOnInit(): void {
      this.characters = this.characterService.getPcObservableList(6);
      this.monsters = this.monsterService.getMonsterObservableList(4);
      this.maps = this.mapService.getMapObservableList(4);
      this.items = this.itemService.getItemObservableList(6);
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

    toItem(name) {
      this.router.navigate(['/myItems/', name]);
    }
}
