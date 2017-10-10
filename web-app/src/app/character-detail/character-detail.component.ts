// Angular Core
import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

// Authored
import {CharacterService} from '../_services/character.service';

// AngularFire2
import {PC} from './Character';
import {AngularFireObject} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';


@Component({
    selector: 'character-detail',
    templateUrl: './character-detail.component.html',
})
export class CharacterDetailComponent implements OnInit {
    constructor(
        private characterService: CharacterService,
        private route: ActivatedRoute,
        private location: Location
    ) {}

    classes: string[] = [
      'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
        'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
    ];
    pc: Observable<any>;

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const name = params.get('name');
            this.pc = this.characterService.getPC(name);
        });
    }

    savePC(): void {
    }

    goBack(): void {
        this.location.back();
    }
}
