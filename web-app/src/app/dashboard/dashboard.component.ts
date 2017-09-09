import { Component, OnInit } from '@angular/core';

import { CreatureService } from '../../_services/creature.service';
import { PC } from '../pc-detail/PC';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
    constructor(private creatureService: CreatureService) { }

    myCharacters: PC[] = [];

    ngOnInit(): void {
        this.creatureService.getPCs()
            .then(myPCs =>
                this.myCharacters = myPCs.slice(0, 4)
            );
    }
}
