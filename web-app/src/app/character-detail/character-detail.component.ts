// Angular Core
import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

// Authored
import {CharacterService} from '../_services/character.service';

// AngularFire2
import {PC} from './Character';


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
    pc: PC;

    ngOnInit(): void {
        this.pc = new PC();
        this.route.paramMap.subscribe(params => {
            this.pc.name = params.get('name');
        });
    }

    savePC(): void {
    }

    goBack(): void {
        this.location.back();
    }
}
