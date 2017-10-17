// Angular Core
import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

// Authored
import {CharacterService} from '../_services/character.service';
import {Character} from './Character';

// AngularFire2
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

    pc: Character;
    pcRef: AngularFireObject<Character>;
    pcData: Observable<Character>;

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const name = params.get('name');
            this.pcRef = this.characterService.getPcRef(name);
            this.pcData = this.pcRef.valueChanges();
            this.pcData.subscribe(character => {
              this.initPC(character);
            });
        });
    }

    initPC(charData: Character): void {
      this.pc = new Character(charData);
    }

    savePC(): void {
      this.pcRef.update(this.pc);
    }

    goBack(): void {
        this.location.back();
    }
}
