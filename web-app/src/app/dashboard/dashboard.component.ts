import { Component, OnInit } from '@angular/core';

import { CharacterService } from '../_services/character.service';
import { PC } from '../character-detail/Character';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
    constructor(
        private characterService: CharacterService,
    ) { }


    ngOnInit(): void {
    }
}
